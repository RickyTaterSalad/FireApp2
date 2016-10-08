import {Injectable} from '@angular/core';
import {ConfigProvider} from "./config-provider";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {HttpProvider} from "./http-provider";
import {AuthProvider} from "./auth-provider";
import {AlertProvider} from "./alert-provider";

@Injectable()
export class AccountProvider {
  selfEndpoint:string;
  _self:Object;

  constructor(private config:ConfigProvider, private httpProvider:HttpProvider, private authProvider:AuthProvider, private alertProvider:AlertProvider) {
    this.selfEndpoint = config.restApiUrl + "/self";
    authProvider.loginState.subscribe((loggedIn)=> {
      if (!loggedIn) {
        this._self = null;
      }
      else {
        this.loadSelf();
      }
    });
  }

  private loadSelf:Function = function () {
    var subject = this.httpProvider.get(this.selfEndpoint);
    subject.subscribe((selfResponse)=> {
      if (selfResponse) {
        this._self = selfResponse;
      }
    }, (err)=> {
        this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Load User", "Error");
    });
    return subject;
  };

  self:Function = function () {
    if (this._self) {
      return Observable.of(this._self);
    }
    else {
      return this.loadSelf();
    }
  };

  public isRegistered:Function = function(){
    return  this._self
            && !this._self.platoon
            && !this._self.station
            && !this._self.assignedHireCode;
  };

  register: Function = function(registerParams) {
    if(!registerParams){
      return Observable.empty();
    }
      var account = this._self;
      let body = JSON.stringify({registration: registerParams});
      var sub = this.httpProvider.postJSON(this.selfEndpoint, body);
      sub.subscribe(()=> {
        //this.authProvider.reloadUser();
      }, (err)=> {
        this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Register User", "Error");
      });
      return sub;
  };
}

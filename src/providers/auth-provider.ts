import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GooglePlus} from 'ionic-native';
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {ConfigProvider} from "./config-provider"
import {Storage} from '@ionic/storage';
import {PlatformProvider} from "./platform-provider";
import {AlertProvider} from "./alert-provider";
import {ConnectivityProvider} from "./connectivity-provider"

import 'rxjs/add/operator/map';

interface UserData {
  token:string;
  user:Object;
}

@Injectable()
export class AuthProvider {
  private userDataKey:string = "user_data";
  public token:string;
  public loginState:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  configProvider:ConfigProvider;
  http:Http;
  connectivityProvider:ConnectivityProvider;
  alertProvider:AlertProvider;
  constructor(private storage:Storage, private connectivityProvider:ConnectivityProvider, private configProvider:ConfigProvider, private http:Http, private platformProvider:PlatformProvider, private alertProvider:AlertProvider) {
    this.loadUserFromStorage();
  }

  //reads local storage for JWT. if JWT not found it will fire the loggedOut subject
  private loadUserFromStorage:Function = function () {
    this.storage.get(this.userDataKey).then((userData:string) => {
      if (userData) {
        try {
          var userDataObj:UserData = JSON.parse(userData);
          if (!userDataObj.token) {
            //storage is bad, log user out to clear
            this.logUserOut();
          }
          else {
            //token is good
            this.token = userDataObj.token;
            this.loginState.next(true);
          }
        }
        catch (err) {
          //oops
          this.logUserOut();
          this.loginState.next(false);
        }
      }
      else {
        //nothing in storage
        this.loginState.next(false);
      }
    });
  };
  //logs the user in and then stores the token in local storage
  login:Function = function () {
    var tokenSubject = new Subject();
    this.storage.get(this.userDataKey).then((userData:string) => {
      console.log("found user data in cache");
      if (userData) {
        var userDataObj:UserData = JSON.parse(userData);
        if (!userDataObj.token) {
          this.loginRemote().subscribe(tokenSubject);
        }
        else {
          tokenSubject.next(userDataObj);
        }
      }
      else {

        this.loginRemote().subscribe(tokenSubject)
      }
    });
    tokenSubject.subscribe((userData:UserData)=> {
      console.dir(userData);
      if (userData && userData.token) {
        this.token = userData.token;
        this.persistUser(userData);
        this.loginState.next(true);
      }
    });
    return tokenSubject;
  };
  private persistUser:Function = function (userData) {
    this.storage.set(this.userDataKey, JSON.stringify(userData));
  };

  private loginRemote:Function = function () {
    if (!this.connectivityProvider.isOnline) {
      return this.alertProvider.showLongMessage("No Internet","Error");
    }
    return this.loginDebugToken();
  };
  private loginDebugToken:Function = function () {
    var sub = this.http.get(this.configProvider.debugTokenUrl).map(res => res.json());
    sub.subscribe(()=> {

    }, (err)=> {
      this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Retrieve Debug Token", "Error");
    });
    return sub;
  };
  private loginGoogle:Function = function () {
    return Observable.create((observer) => {
      console.log('google login');
      GooglePlus.login({'webClientId': '746307695217-p1o92k627ea6fdtd3s0921gqfs68f78q.apps.googleusercontent.com'})
        .then((res:any) => {
          if (res && res.idToken) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
            var data = JSON.stringify({
              id_token: res.idToken
            });
            console.log("login params");
            console.dir(data);
            this.http.post(this.configProvider.googleAuthUrl, data, {headers: headers}).map(res => res.json()).subscribe(
              (res)=> {
                observer.next(res);
              }, (err)=> {
                this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Log Into Google", "Error");
                observer.next(null);
              }, () => {
                observer.complete();
              }
            )
          }
        },
        (err) => {
          this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Log Into Google", "Error");
        });
    });
  };
  logUserOut:Function = function () {
    this.token = null;
    this.storage.remove(this.userDataKey);
    this.loginState.next(false);
  }
}

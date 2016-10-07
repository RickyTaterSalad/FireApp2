import {Injectable} from '@angular/core';
import {ConfigProvider} from "./config-provider";
import {Observable, Subject} from "rxjs";
import {HttpProvider} from "./http-provider";
import {AuthProvider} from "./auth-provider";
import {AlertProvider} from "./alert-provider";
import {Storage} from '@ionic/storage';


@Injectable()
export class AssignHireCodeProvider {

    ahCodesEndpoint:string;
    ahCodes:any;
    private storage:Storage;
    private ahCodesKey:string = "ahCodes";

    constructor(private config:ConfigProvider,
                private httpProvider:HttpProvider,
                private alertProvider:AlertProvider,
                private authProvider:AuthProvider,
                private storage:Storage) {

            this.ahCodesEndpoint =   config.restApiUrl + "/ahCodes";
            this.authProvider.loginState.subscribe((loggedIn)=> {
                  if (!loggedIn) {
                    this.ahCodes = null;
                  }
                  else {
                    this.loadCodes();
                  }
            });
    }

    loadCodes:Function = function(){
        var subject = new Subject();
        this.storage.get(this.ahCodesKey).then((ahCodesString:string) => {
          if (ahCodesString) {
            try {
              var asJson = JSON.parse(ahCodesString);
              this.ahCodes = asJson;
              subject.next(asJson);
              subject.complete();
              return;
            }
            catch (err) {

            }
          }
          var remoteCodesSubject = this.httpProvider.get(this.ahCodesEndpoint,null);
          remoteCodesSubject.subscribe((ahCodes)=> {
              if (ahCodes) {
                this.ahCodes = ahCodes;
                this.storage.set(this.ahCodesKey, JSON.stringify(ahCodes));
                subject.next(this.ahCodes);
              }
            },
            (err)=> {
              this.alertProvider.showShortMessage(err && err._body ? err._body : "Could Not Load AH Codes", "Error");
            }
          );
        });
        return subject;
    };

    AHCodes:Function = function(){
        if(this.ahCodes) {
            return Observable.of(this.ahCodes);
        }
        else {
            return this.loadCodes();
        }
    }
}

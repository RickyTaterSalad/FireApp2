import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth-provider";
import {PlatformProvider} from "../../providers/platform-provider";
import {DepartmentProvider} from "../../providers/department-provider";

/*
 Generated class for the LoginPage page.
*/
@Component({
  selector: "login-page",
  templateUrl: 'login.html',
})
export class LoginPage {
  loginMode:string = "login";


  constructor(  private navCtrl:NavController,
                private navParams: NavParams,
                private authProvider:AuthProvider,
                private platformProvider:PlatformProvider,
                private departmentProvider:DepartmentProvider) {



  }

  logUserIn:Function = function () {
    console.log("LOG ING");
    this.authProvider.login();
  }
}

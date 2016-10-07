import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AuthProvider} from "../../providers/auth-provider";
import {AccountProvider} from "../../providers/account-provider";


/*
 Generated class for the AccountPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: "account-page",
  templateUrl: 'account.html',
})
export class AccountPage {
  public account = {};
  authProvider:AuthProvider;

  constructor(private navCtrl:NavController, private authProvider:AuthProvider, private accountProvider:AccountProvider) {
    this.authProvider.loginState.subscribe((loggedIn)=> {
      if (!loggedIn) {
        this.account = {};
      }
      else {
        this.accountProvider.self().subscribe((account)=> {
          this.account = account;
        })
      }
    });

  }

  public logUserOut:Function = function () {
    this.authProvider.logUserOut();
  }
}

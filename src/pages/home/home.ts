import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AccountPage} from "../account/account";
import {CalendarPage} from "../calendar/calendar";
import {MyPostsPage} from "../my-posts/my-posts";

import {NotificationsPage } from "../notifications/notifications";

/*
 Generated class for the HomePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: "home-page",
  templateUrl: 'home.html',
})
export class HomePage {
  constructor(private navCtrl:NavController) {

  }

  goToCalendar:Function = function () {
    this.navCtrl.setRoot(CalendarPage);

  };
  goToMessages:Function = function () {
    this.navCtrl.setRoot(NotificationsPage);
  };
  goToShiftManager:Function = function () {
    this.navCtrl.setRoot(MyPostsPage);
  };
  goToPayback:Function = function () {
    this.navCtrl.setRoot(MyPostsPage);
  };
  goToAccount:Function = function () {
    this.navCtrl.setRoot(AccountPage);
  };
  goToSettings:Function = function () {
    this.navCtrl.setRoot(AccountPage);
  };

}

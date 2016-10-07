import {Component, ViewChild} from '@angular/core';
import { Platform,Nav,MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import {AccountProvider} from "..//providers/account-provider";
import {LoginPage} from '../pages/login/login';
import {CalendarPage} from '../pages/calendar/calendar';
import {AccountPage} from '../pages/account/account';
import {NotificationsPage} from '../pages/notifications/notifications';
import {MyPostsPage} from '../pages/my-posts/my-posts';
import {MyOffersPage} from '../pages/my-offers/my-offers';
import {AuthProvider} from "../providers/auth-provider";
import {RegisterPage} from '../pages/register/register';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;
  pages:Array<{title: string, component: any}>;

  constructor(private menu:MenuController, platform:Platform, authProvider:AuthProvider, accountProvider:AccountProvider) {
    platform.ready().then(() => {

        this.pages = [
          {title: 'Calendar', component: CalendarPage},
          {title: "Notifications", component: NotificationsPage},
          {title: "My Posts", component: MyPostsPage},
          {title: "My Offers", component: MyOffersPage},
          {title: 'Account', component: AccountPage},
          {title: "Home", component: HomePage},

        ];
        StatusBar.styleDefault();
        authProvider.loginState.subscribe((loggedIn)=> {
          if (loggedIn) {
            if (accountProvider.isRegistered()) {
              console.log("home page");
              this.nav.setRoot(HomePage);

            }
            else {
              console.log("register page");
              this.nav.setRoot(RegisterPage);
            }
          }
          else {
            this.nav.setRoot(LoginPage);
          }
        });
      }
    );
  }

  openPage = function (page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

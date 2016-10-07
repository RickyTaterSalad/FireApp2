import {Component } from '@angular/core';
import {NavParams, NavController,AlertController,LoadingController } from 'ionic-angular';
import {CreatePostPage} from '../create-post/create-post';
import {CreateConversationPage} from '../create-conversation/create-conversation';
import {PostProvider} from "../../providers/post-provider";
import {AccountProvider} from "../../providers/account-provider";



/*
 Generated class for the CalendarDetailPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: "calendar-detail-page",
  templateUrl: 'calendar-detail.html'
})
export class CalendarDetailPage {
  day:any;
  calendarStart:number = null;
  loading:boolean = true;
  yes:boolean = true;
  postTypeToDisplay:string = "on";
  account = {
    firstName: "",
    lastName: "",
    platoon: "",
    department: "",
    station: "",
    id: "",
    photo: "",
    assignedHireCode: ""
  };
  posts = [];
  searchParameters = {
    isOvertime: true,
    isTrade: true,
    isOnType: true,
    isOffType: false,
    sortField: "sortByCreatedDescending"
  };
  filteredPosts;
  accountProvider:AccountProvider;
  alertCtrl:AlertController;

  constructor(private Loading:LoadingController, private nav:NavController, private accountProvider:AccountProvider, private alertCtrl:AlertController, private navParams:NavParams, private postProvider:PostProvider) {
    try {
      console.log("setting day");
      this.day = navParams.data.day;
      console.log("set day");
    }
    catch(err){
      console.dir(err);
    }
    console.log("setting cal start");
    this.calendarStart = navParams.data.calendarStart;
  }

  ionViewDidEnter() {
    console.log("view entered");
    this.reloadPosts();
  }

  refreshPosts:Function = function (refresher) {
    this.reloadPosts();
    setTimeout(()=> {
      refresher.complete()
    }, 1000);
  };
   reloadPosts:Function = function () {
    this.loading = true;
    this.accountProvider.self().subscribe((account)=> {
      this.account = account;
      this.postProvider.getPostsForDay(this.day).subscribe((posts)=> {
        this.posts = posts;
        this.filterResults();
        if (this.posts != null) {
          let hasWantsToWork = false;
          let hasWantsOff = false;
          for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].requestType == "on") {
              hasWantsToWork = true;
              break;
            }
            else {
              hasWantsOff = true;
            }
          }
          if (!hasWantsToWork && hasWantsOff) {
            this.showWantsOff();
          }
        }
        this.loading = false;
      });
    });
  };
  sortPostArray:Function = function (postArray) {
    if (!postArray || !this.searchParameters || !this.searchParameters.sortField) {
      return;
    }
    if (this[this.searchParameters.sortField] instanceof Function) {
      return postArray.sort(this[this.searchParameters.sortField]);
    }
    else {
      return postArray;
    }
  };
  toggleTrade:Function = function () {
    //  console.log("toggle trade");
    this.searchParameters.isTrade = !this.searchParameters.isTrade;
    this.filterResults();
  };
  toggleOvertime:Function = function () {
    //console.log("toggle overtime");
    this.searchParameters.isOvertime = !this.searchParameters.isOvertime;
    this.filterResults();
  };
  toggleOff:Function = function () {
    //  console.log("toggle off");
    this.searchParameters.isOffType = !this.searchParameters.isOffType;
    this.filterResults();
  };
  toggleOn:Function = function () {
    // console.log("toggle on");
    this.searchParameters.isOnType = !this.searchParameters.isOnType;
    this.filterResults();
  };
  sortPosts:Function = function () {
    this.sortPostArray(this.filteredPosts);
  };
  messageUser:Function = function (post) {
    this.nav.push(CreateConversationPage, {day: this.day, post: post});
  };
  removePost:Function = function (post) {
    if (!post) {
      return;
    }
    let confirm = this.alertCtrl.create({
      title: 'Remove Post?',
      message: 'Are You Sure You Want To Remove This Post?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.postProvider.remove(post).subscribe(
              ()=> {
                this.reloadPosts();
              }
            )
          }
        },
        {
          text: 'No',
          handler: () => {

          }
        }
      ]
    });
    confirm.present();

  };
  createPost:Function = function () {
    this.postProvider.userHasPostForDate(this.day).subscribe(
      () => {
        this.nav.push(CreatePostPage, {day: this.day,account:this.account,calendarStart:this.calendarStart});
      }
    );
  };

  filterResults:Function = function () {
    let tempFilteredPosts = this.posts.filter((post) => {
      if (!this.searchParameters.isOffType && post.requestType == "off") {
        return false;
      }
      if (!this.searchParameters.isOnType && post.requestType == "on") {
        return false;
      }
      var tradeGood = this.searchParameters.isTrade && post.isTrade;
      var overtimeGood = this.searchParameters.isOvertime && post.isOvertime;
      return tradeGood || overtimeGood;

    });
    this.filteredPosts = this.sortPostArray(tempFilteredPosts);
  };
  sortByLastNameAscending:Function = function (a, b):Number {
    if (a.creator.lastName < b.creator.lastName) {
      return -1;
    } else if (a.creator.lastName > b.creator.lastName) {
      return 1;
    } else {
      return 0;
    }
  };


  sortByCreatedAscending:Function = function (a, b):Number {
    if (a.created < b.created) {
      return -1;
    } else if (a.created > b.created) {
      return 1;
    } else {
      return 0;
    }
  };

   sortByCreatedDescending:Function = function (a, b):Number {
    if (a.created < b.created) {
      return 1;
    } else if (a.created > b.created) {
      return -1;
    } else {
      return 0;
    }
  };
  sortByStationNumberAscending:Function = function (a, b):Number {
    if (a.station.stationNumber < b.station.stationNumber) {
      return 1;
    } else if (a.station.stationNumber > b.station.stationNumber) {
      return -1;
    } else {
      return 0;
    }
  };
  showWantsToWork:Function = function () {
    this.searchParameters.isOnType = true;
    this.searchParameters.isOffType = false;
    this.filterResults();

  };
  showWantsOff:Function = function () {
    this.searchParameters.isOnType = false;
    this.searchParameters.isOffType = true;
    this.filterResults();
  };

}


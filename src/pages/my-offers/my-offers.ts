import { Component } from '@angular/core';
import { ActionSheetController} from 'ionic-angular';
import {PostProvider} from "../../providers/post-provider";
import {AccountProvider} from "../../providers/account-provider";



@Component({
  selector: "my-offers-page",
  templateUrl: 'my-offers.html'
})
export class MyOffersPage {
  loading:boolean = true;
  posts= [];
  conversations:Object = {};
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

  constructor(private postProvider:PostProvider, private actionSheetCtrl:ActionSheetController, private accountProvider:AccountProvider) {

  }

  showPostOptions:Function = function (post) {
    var buttons =
      [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }];

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post Options',
      buttons: buttons
    });
    actionSheet.present();
  };

  ionViewDidEnter() {
    this.reloadPosts();
  }

  confirmShift:Function = function (conversation) {
    this.postProvider.claimPost(conversation.post, conversation.recipient).subscribe(
      (response)=> {
      }
    )
  };
  reloadPosts:Function = function () {
    this.loading = true;
    this.conversations = {};
    this.accountProvider.self().subscribe((account) => {
        this.account = account;
        this.postProvider.getMyOffers().subscribe(
          (response) => {
            this.posts = [];
            if (response) {
              this.posts = response.posts || [];
              this.conversations = response.conversations || {};
              for (var i = 0; i < this.posts.length; i++) {
                this.posts[i].conversationCount = this.conversations[this.posts[i].id] ? this.conversations[this.posts[i].id].length : 0;
              }
            }
          },
          ()=> {
          },
          () => {
            this.loading = false;
          });
      },
      ()=> {
      },
      () => {
        this.loading = false;
      });
  }
}

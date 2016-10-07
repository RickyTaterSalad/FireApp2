import { Component } from '@angular/core';
import { NavController,ActionSheetController,NavParams  } from 'ionic-angular';
import {ConversationProvider} from "../../providers/conversation-provider";
import {AccountProvider} from "../../providers/account-provider";
import {PostProvider} from "../../providers/post-provider";
import {MessageUserPage} from "../message-user/message-user";


/*
 Generated class for the ConversationsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: "conversations-page",
  templateUrl: 'conversations.html'
})
export class ConversationsPage {
  static  allowUserMessageInPost:boolean = false;
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
  post;
  conversations = [];

  constructor(private navParams:NavParams, private postProvider:PostProvider, private actionSheetCtrl:ActionSheetController, private nav:NavController, private conversationProvider:ConversationProvider, private accountProvider:AccountProvider) {
    this.conversations = navParams.data.conversations || [];
    this.post = navParams.data.post;
    this.account = navParams.data.account;
  }

  replyToConversation:Function = function (conversation, evt:Event) {
    if (evt) {
      evt.stopPropagation();
    }
    if (!conversation) {
      return;
    }
    this.nav.push(MessageUserPage, {conversation: conversation});
  };

  sortConversations:Function = function (a, b) {
    if (a.post.shift < b.post.shift) {
      return -1;
    }
    if (a.post.shift > b.post.shift) {
      return 1;
    }
    return 0;

  };

  confirmShift:Function = function (conversation) {
    this.postProvider.claimPost(conversation.post, conversation.recipient).subscribe(
      (response)=> {
      }
    )
  };
  showConversationOptions:Function = function (conversation) {
    var buttons =
      [
        {
          text: 'Reply',
          role: null,
          handler: () => {
            this.replyToConversation(conversation, null);
          }
        },

        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }];

    if (this.account.id == conversation.post.creator) {
      var confirmButton = {
        role: null,
        text: 'Confirm Swap',
        handler: () => {
          this.confirmShift(conversation)

        }
      };
      buttons.unshift(confirmButton);
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post Options',
      buttons: buttons
    });
    actionSheet.present();
  }

}

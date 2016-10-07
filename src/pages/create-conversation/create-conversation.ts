import { Component } from '@angular/core';
import { NavController,NavParams} from 'ionic-angular';
import {ConversationProvider} from "../../providers/conversation-provider"
import {MessageProvider} from "../../providers/message-provider"
import {AlertProvider} from "../../providers/alert-provider";

import {Day} from "../../models/day";


interface CreateConversation {
  post;
  message:String;
  swapType:string;
}

@Component({
  selector: "create-conversation-page",
  templateUrl: 'create-conversation.html'
})
export class CreateConversationPage {
  post;
  account;
  day:Day;
  messageData:CreateConversation;
  conversationProvider:ConversationProvider;

  constructor(private alertProvider:AlertProvider, private nav:NavController, private navParams:NavParams, private conversationProvider:ConversationProvider, private messageProvider:MessageProvider) {
    this.post = navParams.data.post;
    this.day = navParams.data.day;
    this.messageData = {post: this.post, message: "", swapType: ""};
    if (this.post) {
      if (this.post.isOvertime && this.post.isTrade) {
        this.messageData.swapType = "trade";
      }
    }
  }
  createConversation:Function = function () {
    var conversation = {
      conversation: {
        post: {id: this.post.id}
      }
    };
    this.conversationProvider.create(conversation).subscribe(
        response => {
        var message = {
          conversation: {id: response.id},
          content: this.messageData.message
        };
        this.messageProvider.create(message).subscribe(
          (response)=> {
            this.alertProvider.showShortMessage('Created Conversation', 'Success');
          }
        )
      });
  }
}

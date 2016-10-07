import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {AccountProvider} from "../../providers/account-provider";
import {MessageProvider} from "../../providers/message-provider";
import {AlertProvider} from "../../providers/alert-provider";



@Component({
  selector: "message-user-page",
  templateUrl: 'message-user.html'
})
export class MessageUserPage {
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
  message = {
    conversation: null,
    sender: "",
    recipient: "",
    content: ""
  };
  messageProvider:MessageProvider;

  constructor(private alertProvider:AlertProvider, private nav:NavController, private navParams:NavParams, private accountProvider:AccountProvider, private messageProvider:MessageProvider) {
    this.message.conversation = navParams.data.conversation;
  }

  ionViewDidEnter() {
    this.accountProvider.self().subscribe((account) => {
      this.account = account;
    });
  }

  sendMessage:Function = function () {
    this.messageProvider.create(this.message).subscribe(
      (response) => {
        if (response && response.id) {
          this.message.conversation.messages.push(response);
          this.nav.pop();
          this.alertProvider.showShortMessage("Message Sent", "Success");
        }
        else {
          this.alertProvider.showShortMessage("Could Not Send Message", "Error");
        }
      });
  }

}

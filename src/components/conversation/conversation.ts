import {Component,Input} from '@angular/core'
import { NavController,ActionSheetController,AlertController} from 'ionic-angular';



import {MessageUserPage} from "../../pages/message-user/message-user";

@Component({
  selector: 'conversation',
  templateUrl: 'conversation.html'
})
export class ConversationComponent {
  @Input() conversation;
  @Input() account;

  constructor(private nav:NavController, private actionSheetCtrl:ActionSheetController, private alertCtrl:AlertController) {
  }

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
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post Options',
      buttons: buttons
    });
    actionSheet.present();
  };
  toggleConversation:Function = function (conversation) {
    if (conversation) {
      conversation.collapsed = !conversation.collapsed;
    }
  };

  replyToConversation:Function = function (conversation, evt:Event) {
    if (evt) {
      evt.stopPropagation();
    }
    if (!conversation) {
      return;
    }
    this.nav.push(MessageUserPage, {conversation: conversation});
  };
}

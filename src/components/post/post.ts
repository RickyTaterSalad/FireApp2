import {Component,Input} from '@angular/core'
import { NavController,ActionSheetController} from 'ionic-angular';
import {EditPostPage} from "../../pages/edit-post/edit-post"
import {PostProvider} from "../../providers/post-provider";
import {ConversationProvider} from "../../providers/conversation-provider";
import {CreateConversationPage} from '../../pages/create-conversation/create-conversation';
import {ConversationsPage} from '../../pages/conversations/conversations';
import {EventProvider} from "../../providers/event-provider";
import {AlertProvider} from "../../providers/alert-provider";


import {Day} from "../../models/day";




@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {
  @Input() post;
  @Input() account;
  @Input() day:Day;
  @Input() showmessageuser:boolean = false;
  @Input() showuserinheader:boolean = false;

  constructor(private alertProvider:AlertProvider, private eventProvider:EventProvider, private nav:NavController, private actionSheetCtrl:ActionSheetController,private postProvider:PostProvider, private conversationProvider:ConversationProvider) {
  }

  editPost:Function = function (post) {
    this.nav.push(EditPostPage, {post: post,account:this.account});
  };

  messageUser:Function = function () {
    this.nav.push(CreateConversationPage, {day: this.day, post: this.post});
  };

  removePost:Function = function (post) {
    if (!post) {
      return;
    }
    this.postProvider.remove(post).subscribe(
      (response)=> {
        if (response && response.success) {
          this.eventProvider.postRemoved.emit(post);
          this.alertProvider.showShortMessage("Post Removed", "Success")
        }
        else {
          this.alertProvider.showShortMessage("Could Not Remove Post", "Error")
        }
      }
    )
  };
  showPostOptions:Function = function () {
    var buttons =
      [
        {
          text: 'Edit Post',
          role: null,
          handler: () => {
            this.editPost(this.post);
          }
        },
        {
          text: 'Remove Post',
          role: null,
          handler: () => {
            this.removePost(this.post);
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
  goToConversations:Function = function () {
    this.conversationProvider.getConversationsForPost(this.post.id).subscribe((conversations) => {
      //should be able to use the observable methods to add collapsed
      this.nav.push(ConversationsPage, {conversations: conversations, account: this.account, post: this.post});
    })
  }
}

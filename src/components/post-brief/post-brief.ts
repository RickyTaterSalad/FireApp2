import {Component,Input} from '@angular/core'
import { NavController,ActionSheetController} from 'ionic-angular';
import {EditPostPage} from "../../pages/edit-post/edit-post"
import {PostProvider} from "../../providers/post-provider";
import {CreateConversationPage} from '../../pages/create-conversation/create-conversation';
import {AlertProvider} from "../../providers/alert-provider";

import {Day} from "../../models/day";



@Component({
  selector: 'post-brief',
  templateUrl: 'post-brief.html'
})

export class PostBriefComponent {
  @Input() post;
  @Input() account;
  @Input() day:Day;
  @Input() allowmessage:boolean = true;
  @Input() showuserinheader:boolean = false;
  actionSheetCtrl:ActionSheetController;


  constructor(private alertProvider:AlertProvider, private nav:NavController, private actionSheetCtrl:ActionSheetController, private postProvider:PostProvider) {
  }

  editPost:Function = function (post) {
    this.nav.push(EditPostPage, {post: post});
  };

  messageUser:Function = function () {
    if(!this.allowmessage){
      return
    }
    this.nav.push(CreateConversationPage, {day: this.day, post: this.post});
  };

  removePost:Function = function (post) {
    if (!post) {
      return;
    }
    this.postProvider.remove(post).subscribe(
      (response)=> {
        //   this.reloadPosts();
      });
  };
  showPostOptions:Function = function (post) {
    var buttons = [];
    buttons.push(
      {
        text: 'Edit Post',
        role: null,
        handler: () => {
          this.editPost(post);
        }
      });
    if (post && post.creator.id == this.account.id) {
      buttons.push({
        text: 'Remove Post',
        role: null,
        handler: () => {
          this.removePost(post);
        }
      });
    }


    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
      }
    });

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post Options',
      buttons: buttons
    });
    actionSheet.present();
  };

}

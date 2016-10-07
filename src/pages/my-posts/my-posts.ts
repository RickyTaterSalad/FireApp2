import { Component } from '@angular/core';
import {PostProvider} from "../../providers/post-provider";
import {AccountProvider} from "../../providers/account-provider";
import {EventProvider} from "../../providers/event-provider";


/*
 Generated class for the MyPostsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
  selector: "my-posts-page",
  templateUrl: 'my-posts.html'
})
export class MyPostsPage {
  loading:boolean = true;
  posts = [];
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

  constructor(private eventProvider:EventProvider, private postProvider:PostProvider, private accountProvider:AccountProvider) {
    this.reloadPosts();
    eventProvider.postRemoved.subscribe((post)=> {
      if (post) {
        var idx = this.posts.indexOf(post);
        if (idx > -1) {
          this.posts.splice(idx, 1);
        }
      }
    });
  }


  confirmShift:Function = function (conversation) {
    this.postProvider.claimPost(conversation.post, conversation.recipient).subscribe(
      (response)=> {
      }
    )
  };
  reloadPosts:Function = function () {
    this.loading = true;
    this.accountProvider.self().subscribe((account) => {
        this.account = account;
        this.postProvider.getMyPosts().subscribe(
          (response) => {
            this.posts = [];
            this.posts = response.posts || [];
            this.conversations = response.conversations || {};
            for (var i = 0; i < this.posts.length; i++) {
              this.posts[i].conversationCount = this.conversations[this.posts[i].id] ? this.conversations[this.posts[i].id].length : 0;
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

import { Storage } from '@ionic/storage';
import {MenuController  } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AccountPage } from '../pages/account/account';
import { CalendarPage } from '../pages/calendar/calendar';
import { CalendarDetailPage } from '../pages/calendar-detail/calendar-detail';
//pages
import { ConversationsPage } from '../pages/conversations/conversations';
import { CreateConversationPage } from '../pages/create-conversation/create-conversation';
import { CreatePostPage } from '../pages/create-post/create-post';
import { EditPostPage } from '../pages/edit-post/edit-post';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MessageUserPage } from '../pages/message-user/message-user';
import { MyOffersPage } from '../pages/my-offers/my-offers';
import { MyPostsPage } from '../pages/my-posts/my-posts';
import { NotificationsPage } from '../pages/notifications/notifications';
import { RegisterPage } from '../pages/register/register';

//pipes
import { MomentToString } from '../pipes/moment-to-string';
import { ObjectContainsProperty } from '../pipes/object-contains-property';

//components
import { ConversationComponent } from '../components/conversation/conversation';
import { PostComponent } from '../components/post/post';
import { PostBriefComponent } from '../components/post-brief/post-brief';

//providers
import { AccountProvider } from '../providers/account-provider';
import { AlertProvider } from '../providers/alert-provider';
import { AssignHireCodeProvider } from '../providers/assign-hire-provider';
import { AuthProvider } from '../providers/auth-provider';
import { ConfigProvider } from '../providers/config-provider';
import { ConnectivityProvider } from '../providers/connectivity-provider';
import { ConversationProvider } from '../providers/conversation-provider';
import { DepartmentProvider } from '../providers/department-provider';
import { EventProvider } from '../providers/event-provider';
import { HttpProvider } from '../providers/http-provider';
import { MessageProvider } from '../providers/message-provider';
import { NotificationProvider } from '../providers/notification-provider';
import { PlatformProvider } from '../providers/platform-provider';
import { PostProvider } from '../providers/post-provider';
import { StationProvider } from '../providers/station-provider';


@NgModule({
  declarations: [
    MyApp,
    AccountPage,
    CalendarPage,
    CalendarDetailPage,
    ConversationsPage,
    CreateConversationPage,
    CreatePostPage,
    EditPostPage,
    HomePage,
    LoginPage,
    MessageUserPage,
    MyOffersPage,
    MyPostsPage,
    NotificationsPage,
    RegisterPage,
    ObjectContainsProperty,
    MomentToString,
    ConversationComponent,
    PostComponent,
    PostBriefComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    CalendarPage,
    CalendarDetailPage,
    ConversationsPage,
    CreateConversationPage,
    CreatePostPage,
    EditPostPage,
    HomePage,
    LoginPage,
    MessageUserPage,
    MyOffersPage,
    MyPostsPage,
    NotificationsPage,
    RegisterPage
  ],
  providers: [
    Storage,
    AccountProvider,
    AlertProvider,
    AssignHireCodeProvider,
    AuthProvider,
    ConfigProvider,
    ConnectivityProvider,
    ConversationProvider,
    DepartmentProvider,
    EventProvider,
    HttpProvider,
    MessageProvider,
    NotificationProvider,
    PlatformProvider,
    PostProvider,
    StationProvider,
    MenuController
  ]
})
export class AppModule {
}

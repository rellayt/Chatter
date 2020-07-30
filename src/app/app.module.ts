import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ChatterComponent } from './chatter/chatter.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LoginComponent, loginDialog } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { RegisterComponent, registerDialog } from './register/register.component';
import { userService } from './_services/user.service';
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { UsersComponent } from './users/users.component';
import { userSourceService } from './_services/users.service';
import { OnlineUsersComponent } from './online-users/online-users.component';
import { ExpansionPanelComponent, optionsDialog } from './expansion-panel/expansion-panel.component';
import { PublicChannelOneComponent } from './public-channel-one/public-channel-one.component';
import { fileService } from './_services/file.service';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { publicMessageService } from './_services/public-messages-one';
import { SidenavComponent, userDialog } from './sidenav/sidenav.component';
import { PrivateMessagesComponent, privateMessagesDialog } from './private-messages/private-messages.component';
import { privateMessageService } from './_services/private-messages.service';

@NgModule({
  declarations: [
    ChatterComponent,
    MainNavComponent,
    LoginComponent,
    loginDialog,
    RegisterComponent,
    registerDialog,
    UsersComponent,
    OnlineUsersComponent,
    ExpansionPanelComponent,
    PublicChannelOneComponent,
    optionsDialog,
    SidenavComponent,
    userDialog,
    PrivateMessagesComponent,
    privateMessagesDialog
  ],
  entryComponents: [LoginComponent, loginDialog, RegisterComponent, registerDialog, optionsDialog, userDialog, privateMessagesDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase, 'chatter'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ],
  providers: [userService, userSourceService, fileService, publicMessageService, privateMessageService],
  bootstrap: [MainNavComponent]
})
export class AppModule { }

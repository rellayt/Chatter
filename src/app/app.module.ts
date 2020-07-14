import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ChatterComponent } from './chatter/chatter.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LoginComponent, loginDialog } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { RegisterComponent, registerDialog } from './register/register.component';
import { userService } from './_services/user.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { UsersComponent } from './users/users.component';
import { userSourceService } from './_services/users.service';

@NgModule({
  declarations: [
    ChatterComponent,
    MainNavComponent,
    LoginComponent,
    loginDialog,
    RegisterComponent,
    registerDialog,
    UsersComponent
  ],
  entryComponents: [LoginComponent, loginDialog, RegisterComponent, registerDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase, 'chatter'),
    AngularFirestoreModule
  ],
  providers: [userService, userSourceService],
  bootstrap: [MainNavComponent]
})
export class AppModule { }

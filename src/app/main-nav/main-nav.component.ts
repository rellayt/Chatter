import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';
import { userService } from '../_services/user.service';
import { userData } from '../login/validation.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnChanges {

  @ViewChild(LoginComponent) loginCmp;

  singleUser: userData = { id: null, username: '', password: '', logged: false };

  userLogged = false;
  username: string;
  constructor(private breakpointObserver: BreakpointObserver, private userData: userService) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1920px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  ngOnInit(): void {
    this.userData.currentUser.subscribe(user => {
      this.singleUser = user;
      console.log('singleuser lol' + this.singleUser.logged);

      this.username = user.username;
      this.userLogged = user.logged;
    }


    );
    this.userLogged = this.singleUser.logged;
  }

  ngOnChanges(): void {
    // this.userLogged = this.loginCmp.userLogged;
    //this.username = this.loginCmp.username;

    console.log("userLogged3: " + this.userLogged);
  }

  logoutUser() {
    this.userLogged = false;
    this.singleUser.logged = false;
  }
  buttonClick(): void {

    console.log("userLogged3: " + this.userLogged);
  }

}

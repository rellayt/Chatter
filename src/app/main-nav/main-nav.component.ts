import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';
import { userService } from '../_services/user.service';
import { userData } from '../userData';
import { userSourceService } from '../_services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnChanges {

  @ViewChild(LoginComponent) loginCmp;

  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  currentUser2: userData = { id: null, username: '', password: '', logged: false };

  userLogged = false;
  username: string;



  constructor(private breakpointObserver: BreakpointObserver, private userData: userService, public userSourceService: userSourceService, private snackBar: MatSnackBar) { }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 1920px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  ngOnInit(): void {
    this.userData.currentUser.subscribe(user => {
      this.currentUser = user;
      this.username = user.username;
      this.userLogged = user.logged;
      this.currentUser2.logged = user.logged;
    }
    );
    this.userLogged = this.currentUser.logged;
    this.userSourceService.getUsers().subscribe(users => {
      this.users = users;
      if (this.username) {
        this.currentUser2 = this.users.find(x => x.username === this.username);
      } else {
        this.currentUser2.logged = false;
      }
    });
  }
  openSnackBar() {
    this.snackBar.open('Logged out', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }
  ngOnChanges(): void {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.userLogged = false;
    this.currentUser = this.users.find(user => user.username === this.currentUser.username);
    this.currentUser.logged = false;
    this.userSourceService.changeUserStatus(this.currentUser);
  }

  logoutUser() {
    this.userLogged = false;
    this.currentUser = this.users.find(user => user.username === this.currentUser.username);
    this.currentUser.logged = false;
    this.userSourceService.changeUserStatus(this.currentUser);
    if (!this.username) {
      this.currentUser2.logged = false;
    }
    this.openSnackBar();
  }
}

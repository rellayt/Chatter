import { Component, OnInit, Input, Inject } from '@angular/core';
import { userSourceService } from '../_services/users.service';
import { fileService } from '../_services/file.service';
import { publicMessageService } from '../_services/public-messages-one';
import { userData } from '../userData';
import { messageData } from '../messageData';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input()
  username = '';

  @Input()
  userLogged = false;

  users: userData[];
  userSearchArray: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };

  messages: messageData[];
  imagesArray: messageData[];
  filesArray: messageData[];

  checked = false;
  color: ThemePalette = 'primary';
  searchValue = '';
  constructor(public dialog: MatDialog, public userService: userSourceService, public publicMessages: publicMessageService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
    this.publicMessages.getPublicMessages().subscribe(messages => {
      this.messages = messages;
      this.imagesArray = this.messages.filter(x => x.image).reverse();
      this.filesArray = this.messages.filter(x => x.fileUrl).reverse();
    });
  }
  createSearchArray(): userData[] {
    this.userSearchArray = this.users.filter(x => x.username.includes(this.searchValue));
    return this.userSearchArray;
  }
  checkSearchArray(): boolean {
    if (this.userSearchArray.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  modifyRegisterDate(): string {
    const registerDate = this.currentUser.registeredDate.substring(0, 10) + ', at ' + this.currentUser.registeredDate.substring(11, 16)
    return registerDate;
  }
  checkIfUserLogged(): boolean {
    if (this.userLogged) {
      this.currentUser = this.users.find(x => x.username === this.username);
    } else {
      this.currentUser.logged = false;
    }
    if (this.currentUser) {
      if (this.currentUser.logged) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkForAvatar(): boolean {
    if (this.currentUser) {
      if (this.currentUser.avatar) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  openUserDialog(username: string, e: any) {
    this.dialog.open(userDialog, {
      width: '420px',
      height: 'auto',
      data: {
        username: username
      }
    });
  }
  slideToggle() {
    this.checked = !this.checked;
  }
}

@Component({
  selector: 'userDialog',
  templateUrl: 'userDialog.html',
  styleUrls: ['./sidenav.component.scss']
})
export class userDialog implements OnInit {
  users: userData[];
  checkedUsername = '';
  checkedUser: userData = { id: null, username: '', password: '', logged: false };

  constructor(public dialog: MatDialogRef<userDialog>, @Inject(MAT_DIALOG_DATA) public username: string, public userService: userSourceService) { }

  ngOnInit() {
    this.checkedUsername = JSON.stringify(this.username).substring(13, (JSON.stringify(this.username).length - 2));
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.checkedUser = this.users.find(x => x.username === this.checkedUsername);
      console.log(this.checkedUser);
    });

  }
  checkForAvatar(): boolean {
    if (this.checkedUser) {
      if (this.checkedUser.avatar) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkIfOnline(): boolean {
    if (this.checkedUser) {
      if (this.checkedUser.logged) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  modifyRegisterDate(): string {
    if (this.checkedUser.registeredDate) {
      return this.checkedUser.registeredDate.substring(0, 10) + ', at ' + this.checkedUser.registeredDate.substring(11, 16);
    } else {
      return '';
    }
  }
  modifyLastOnlineDate(): string {
    if (this.checkedUser.lastOnline) {
      return this.checkedUser.lastOnline.substring(0, 10) + ', at ' + this.checkedUser.lastOnline.substring(11, 16);
    } else {
      return '';
    }
  }
  onNoClick(): void {
    this.dialog.close();
  }
  test(): void {
    console.log('working');
  }

}

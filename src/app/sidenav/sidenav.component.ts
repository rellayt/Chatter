import { Component, OnInit, Input } from '@angular/core';
import { userSourceService } from '../_services/users.service';
import { fileService } from '../_services/file.service';
import { publicMessageService } from '../_services/public-messages-one';
import { userData } from '../userData';
import { messageData } from '../messageData';
import { ThemePalette } from '@angular/material/core';

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
  constructor(public userService: userSourceService, public publicMessages: publicMessageService) { }

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
  slideToggle() {
    this.checked = !this.checked;
  }
}

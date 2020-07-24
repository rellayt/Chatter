import { Component, OnInit, Input } from '@angular/core';
import { messageData } from '../messageData';
import { userSourceService } from '../_services/users.service';
import { userData } from '../login/validation.component';
import { fileService } from '../_services/file.service';
import { publicMessageService } from '../_services/public-messages-one';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-public-channel-one',
  templateUrl: './public-channel-one.component.html',
  styleUrls: ['./public-channel-one.component.scss']
})
export class PublicChannelOneComponent implements OnInit {
  @ViewChild('scrollMe')
  private myScrollContainer: ElementRef;

  @Input()
  username: string;

  @Input()
  userLogged: boolean;

  date = new Date();
  channelOneMessages: messageData[];
  public tempMessage: messageData = new messageData(0, 0, 0, '', '');
  public sendTempMessage: messageData = new messageData(0, 0, 0, '', '');
  inputMessage: string;

  init = 0;

  users: userData[];
  public currentUser: userData = { id: null, username: '', password: '', logged: false };
  tempUser: userData = { id: null, username: '', password: '', logged: false };

  // tslint:disable-next-line: max-line-length
  constructor(private snackBar: MatSnackBar, public userService: userSourceService, public avatars: fileService, public publicMessages: publicMessageService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('usrs', this.users);
      console.log('this.username', this.username);

      this.currentUser = this.users.find(x => x.username === this.username);
      // console.log('a', this.currentUser);
    });
    this.publicMessages.getPublicMessages().subscribe(messages => {
      this.channelOneMessages = messages;
      // console.log('test', this.channelOneMessages);
      // console.log('test2', this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString()));
    });
    // this.scrollToBottom();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  sendMessage() {
    let maxMessageID = this.channelOneMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    // console.log('USER: ', this.currentUser);
    if (this.currentUser) {
      if (this.inputMessage !== '' && this.currentUser.logged) {
        this.sendTempMessage.channelId = 1;
        this.sendTempMessage.date = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
        this.sendTempMessage.message = this.inputMessage;
        this.sendTempMessage.messageId = maxMessageID + 1;
        this.sendTempMessage.userId = this.currentUser.id;
        console.log('msg', this.sendTempMessage);
        this.publicMessages.addPublicMessage(this.sendTempMessage);
        this.inputMessage = '';
      }
    }
  }

  checkUserMessage(userId: number): boolean {
    // if (this.userLogged && this.init === 0) {
    //   this.init++;
    // }
    // if (this.init === 1) {
    //   this.ngOnInit();
    // }
    console.log('CURR USR', this.currentUser);
    console.log('this.userLogged: ', this.userLogged)
    this.currentUser = this.users.find(x => x.username === this.username);
    if (this.currentUser) {
      //  console.log('cr usr id: ', this.currentUser.id, ' userid: ', userId);
      if (this.currentUser.id === userId && this.userLogged) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  createDate(localeDate: string, localeTime: string): string {
    const localeTimeShort = localeTime.substring(0, 5);
    return localeDate + ' ' + localeTimeShort;
  }
  getAvatar(id: number): string {
    if (this.users) {
      this.tempUser = this.users.find(x => x.id === id);
      return this.tempUser.avatar;
    }
  }
  getUsername(id: number): string {
    if (this.users) {
      this.tempUser = this.users.find(x => x.id === id);
      return this.tempUser.username;
    }
  }
  getShortDate(messageId: number): string {
    if (this.users) {
      this.tempMessage = this.channelOneMessages.find(x => x.messageId === messageId);
      return this.tempMessage.date.substring(11, 16);
    }
  }
  getLongDate(messageId: number): string {
    if (this.users) {
      this.tempMessage = this.channelOneMessages.find(x => x.messageId === messageId);
      return this.tempMessage.date.substring(0, 5) + ' ' + this.tempMessage.date.substring(11, 16);
    }
  }

  checkForDate(messageId: number): boolean {
    if (this.users) {
      this.tempMessage = this.channelOneMessages.find(x => x.messageId === messageId);
      const tempDate = new Date();
      const tempMessageDate = tempDate.toLocaleDateString();
      if (this.tempMessage.date.substring(0, 10) === tempMessageDate) {
        return false;
      } else {
        return true;
      }
    }
  }
  checkAvatar(id: number): boolean {
    if (this.users) {
      this.tempUser = this.users.find(x => x.id === id);
      if (this.tempUser.avatar) {
        return true;
      } else {
        return false;
      }
    }
  }
  limitLines(event: InputEvent, maxLines: number) {
    let text = (event.target as HTMLTextAreaElement).value;
    if (text.length > 0) {
      const lineCount = 1 + text.replace(/[^\n]/g, '').length;
      if (lineCount > maxLines) {
        const textArray = text.split('\n');
        const newText = textArray.reduce((result, line, lineNum, array) => {
          if (lineNum < maxLines) {
            return result.concat('\n').concat(line);
          }
          return result.concat(line);
        });
        (event.target as HTMLTextAreaElement).value = newText;
      }
    }
  }
  uploadImage(event: any, message: messageData) {
    const file: File = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      if (this.currentUser) {
        //this.images.putImage(file, message);
        this.openSnackBarSUC();
      } else {
        this.openSnackBarFAIL();
      }

    }
    else {
      this.openSnackBarFAIL();
    }
  }
  openSnackBarFAIL() {
    this.snackBar.open('Image upload failed', 'Cancel', {
      duration: 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar']
    });
  }
  openSnackBarSUC() {
    this.snackBar.open('Image upload completed', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }
}

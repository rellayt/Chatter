import { Component, OnInit, Input } from '@angular/core';
import { messageData } from '../messageData';
import { userSourceService } from '../_services/users.service';
import { userData } from '../userData';
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
  uploadedPhoto = false;
  uploadedFile = false;
  fileName = '';
  fileNameMessage = '';
  messageIdTemp = 0;
  imageUrl = '';
  imageUrl2 = ' ';
  fileUrl = '';
  fileUrl2 = ' ';

  newImage = false;
  newFile = false;
  messageIdStorageTemp = 0;
  fileTemp: File;
  users: userData[];
  public currentUser: userData = { id: null, username: '', password: '', logged: false };
  tempUser: userData = { id: null, username: '', password: '', logged: false };
  tempUser2: userData = { id: null, username: '', password: '', logged: false };

  // tslint:disable-next-line: max-line-length
  constructor(private snackBar: MatSnackBar, public userService: userSourceService, public storage: fileService, public publicMessages: publicMessageService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.username);

    });
    this.publicMessages.getPublicMessages().subscribe(messages => {
      this.channelOneMessages = messages;
    });
    this.storage.currentImage.subscribe(image => {
      console.log("new img ", this.newImage);
      while (this.newImage) {
        this.storage.getImage(this.messageIdStorageTemp);
        if (this.uploadedPhoto) {
          if (image !== this.imageUrl2 && image !== '') {
            if (image) {
              this.imageUrl = image;
              this.imageUrl2 = image;
              this.newImage = false;
            }
          }
        }
      }
    });
    this.storage.currentFile.subscribe(file => {
      while (this.newFile) {
        this.storage.getFile(this.fileTemp, this.messageIdStorageTemp);
        if (this.uploadedFile) {
          if (file !== this.fileUrl2 && file !== '') {
            if (file) {
              this.fileUrl = file;
              this.fileUrl2 = file;
              this.newFile = false;
            }
          }
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
  sendMessage() {
    let maxMessageID = this.channelOneMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    if (this.currentUser) {
      this.messageIdTemp = maxMessageID + 1;
      if (this.currentUser.logged && this.uploadedPhoto && !this.uploadedFile) {
        this.sendTempMessage.channelId = 1;
        this.sendTempMessage.date = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
        this.sendTempMessage.message = this.inputMessage;
        this.sendTempMessage.messageId = maxMessageID + 1;
        this.sendTempMessage.userId = this.currentUser.id;
        this.sendTempMessage.image = this.imageUrl;
        console.log('msg', this.sendTempMessage);
        this.publicMessages.addPublicMessage(this.sendTempMessage);
        this.userService.incUserMessages(this.currentUser);
        this.sendTempMessage.image = undefined;
        this.inputMessage = '';
        this.uploadedPhoto = false;
      } else if (this.currentUser.logged && !this.uploadedPhoto && this.uploadedFile) {
        this.sendTempMessage.channelId = 1;
        this.sendTempMessage.date = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
        this.sendTempMessage.message = this.inputMessage;
        this.sendTempMessage.messageId = maxMessageID + 1;
        this.sendTempMessage.userId = this.currentUser.id;
        this.sendTempMessage.fileUrl = this.fileUrl;
        this.sendTempMessage.fileName = this.fileNameMessage;
        console.log('msg', this.sendTempMessage);
        this.publicMessages.addPublicMessage(this.sendTempMessage);
        this.userService.incUserMessages(this.currentUser);
        this.sendTempMessage.fileUrl = undefined;
        this.sendTempMessage.fileName = undefined;
        this.inputMessage = '';
        this.uploadedFile = false;
      }
      else if (this.inputMessage !== '' && this.currentUser.logged) {
        this.sendTempMessage.fileUrl = undefined;
        this.sendTempMessage.fileName = undefined;
        this.sendTempMessage.image = undefined;
        this.sendTempMessage.channelId = 1;
        this.sendTempMessage.date = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
        this.sendTempMessage.message = this.inputMessage;
        this.sendTempMessage.messageId = maxMessageID + 1;
        this.sendTempMessage.userId = this.currentUser.id;
        console.log('msg', this.sendTempMessage);
        this.publicMessages.addPublicMessage(this.sendTempMessage);
        this.userService.incUserMessages(this.currentUser);
        this.inputMessage = '';
      }
    }
  }
  checkUserMessage(userId: number): boolean {
    this.currentUser = this.users.find(x => x.username === this.username);
    if (this.currentUser) {
      //  console.log('cr usr id: ', this.currentUser.id, ' userid: ', userId);
      if (this.currentUser.id === userId && this.userLogged && this.currentUser.logged) {
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
      return this.tempMessage.date.substring(0, 2) + '/' + this.tempMessage.date.substring(3, 5) + ' ' + this.tempMessage.date.substring(11, 16);
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
  uploadImage(event: any) {
    const messageId = (this.channelOneMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId) + 1;
    const file: File = event.target.files[0];
    if (!this.uploadedFile) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        if (this.currentUser) {
          this.uploadedPhoto = true;
          this.storage.putImage(file, messageId);
          this.checkFileName(file);
          this.fileTemp = file;
          console.log('no wtf', messageId);
          this.messageIdStorageTemp = messageId;
          this.storage.getImage(messageId);
          this.newImage = true;
          this.openSnackBarSUC('Image upload completed');
        } else {
          this.openSnackBarFAIL('Image upload failed');
        }
      }
      else {
        this.openSnackBarFAIL('Image upload failed');
      }
    } else {
      this.openSnackBarBOTH();
    }
  }

  uploadFile(event: any) {
    const messageId = (this.channelOneMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId) + 1;
    const file: File = event.target.files[0];
    console.log(file);
    console.log('message: ', messageId);
    if (!this.uploadedPhoto) {
      if (file.type !== 'image') {
        if (this.currentUser) {
          this.uploadedFile = true;
          this.storage.putFile(file, messageId);
          this.fileNameMessage = file.name;
          this.checkFileName(file);
          this.fileTemp = file;
          this.messageIdStorageTemp = messageId;
          this.storage.getFile(file, messageId);
          this.newFile = true;
          this.openSnackBarSUC('File upload completed');
        } else {
          this.openSnackBarFAIL('File upload failed');
        }
      }
      else {
        this.openSnackBarFAIL('Image upload failed');
      }
    } else {
      this.openSnackBarBOTH();
    }
  }
  checkFileName(file: File) {
    if (file.name.length > 14) {
      this.fileName = 'File uploaded';
    } else {
      this.fileName = file.name;
    }
  }
  checkIfUserLogged(userID: number): boolean {
    if (this.users) {
      this.tempUser2 = this.users.find(x => x.id === userID);
      if (this.tempUser2.logged) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }

  }
  openSnackBarFAIL(comment: string) {
    this.snackBar.open(comment, 'Cancel', {
      duration: 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar']
    });
  }
  openSnackBarSUC(comment: string) {
    this.snackBar.open(comment, 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }
  openSnackBarBOTH() {
    this.snackBar.open('You can only upload one thing at the same time', 'Cancel', {
      duration: 1900,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar']
    });
  }
}

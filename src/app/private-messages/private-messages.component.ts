import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';
import { userData } from '../userData';
import { privMessageData } from '../messageData';
import { single, find } from 'rxjs/operators';
import { TooltipPosition } from '@angular/material/tooltip';
import { privateMessageService } from '../_services/private-messages.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.scss']
})
export class PrivateMessagesComponent implements OnInit {
  @Input()
  username = '';

  constructor(public dialog: MatDialog, public userService: userSourceService) { }

  ngOnInit(): void {
    console.log('username test priv', this.username);
  }
  openMessagesDialog(username: string) {
    this.dialog.open(privateMessagesDialog, {
      width: '1000px',
      height: '750px',
      data: {
        username
      }
    });
  }
}

@Component({
  selector: 'privateMessagesDialog',
  templateUrl: 'private-messages-dialog.html',
  styleUrls: ['./private-messages.component.scss', './user-chat.scss']
})
export class privateMessagesDialog implements OnInit {
  tooltipPosition: TooltipPosition = 'above';
  users: userData[];
  currentUsername = '';
  currentUser: userData = { id: null, username: '', password: '', logged: false };

  userChat = false;
  date = new Date();

  privateMessages: privMessageData[];
  userIdentifier: string[] = new Array();
  userChatMessages: privMessageData[][] = new Array();

  inputPrivMessage = '';
  secUserMain: userData = { id: null, username: '', password: '', logged: false };
  newUserMain: userData = { id: null, username: '', password: '', logged: false };
  currentMessages: privMessageData[] = new Array();

  searchUserInput = '';
  newMessageBool = false;
  newChat = false;
  usernameFormControl = new FormControl('', [Validators.required]);
  // tslint:disable-next-line: max-line-length
  constructor(public dialog: MatDialogRef<privateMessagesDialog>, @Inject(MAT_DIALOG_DATA) public username: string, public userService: userSourceService, public privMessageService: privateMessageService) { }

  ngOnInit() {
    this.currentUsername = JSON.stringify(this.username).substring(13, (JSON.stringify(this.username).length - 2));
    this.privMessageService.getPrivateMessages().subscribe(privateMessages => {
      this.privateMessages = privateMessages;
      this.createUserIdentifier();
      this.createChat();
    });
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.currentUsername);
    });
  }
  sendMessage() {
    let messageToSend: privMessageData = { messageId: 0, fromUserId: 0, toUserId: 0, date: '', message: '' };
    let maxMessageID;
    if (this.inputPrivMessage !== '') {
      if (!this.newChat) {
        maxMessageID = this.privateMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
      } else {
        if (this.privateMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId) {
          maxMessageID = this.privateMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
        } else {
          maxMessageID = 0;
        }
      }

      messageToSend.date = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
      messageToSend.fromUserId = this.currentUser.id;
      if (this.newChat) {
        messageToSend.toUserId = this.newUserMain.id;
      } else {
        messageToSend.toUserId = this.secUserMain.id;
      }
      messageToSend.message = this.inputPrivMessage;
      messageToSend.messageId = maxMessageID + 1;
      this.privMessageService.addPrivateMessage(messageToSend);

      // maxMessageID = this.currentMessages.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId + 1;

      this.currentMessages.reverse();
      this.currentMessages.push(Object.assign({}, messageToSend));
      this.currentMessages.reverse();
      console.log('curr msg', this.currentMessages);
      console.log('user chat meesages', this.userChatMessages);
      let currentChat = this.userChatMessages.indexOf(this.currentMessages);
      console.log(currentChat);
      // :0
    }
    this.inputPrivMessage = '';
  }

  changeStatus() {
    this.newMessageBool = true;
  }
  newMessage() {
    const findUser = this.users.find(user => user.username === this.searchUserInput);
    console.log('bbb', findUser)
    if (findUser) {
      this.newUserMain = findUser;
      console.log('AAAA', this.newUserMain);
      this.userChat = false;
      this.newChat = true;
      this.newMessageBool = false;
      this.currentMessages = new Array();

    } else {
      this.usernameFormControl.setErrors({ 'noResult': true });
    }
  }
  getSecUser(singleChat: privMessageData[]): userData {
    let secUser;
    if (singleChat[0].fromUserId !== this.currentUser.id) {
      secUser = this.users.find(x => x.id === singleChat[0].fromUserId);
    } else {
      secUser = this.users.find(x => x.id === singleChat[0].toUserId);
    }
    return secUser;
  }
  checkIfFirstMessage(message: privMessageData, currentMessages: privMessageData[]): boolean {
    const messageFinderDown = currentMessages.find(x => x.messageId === message.messageId - 1);
    const messageFinderUp = currentMessages.find(x => x.messageId === message.messageId + 1);
    if (message.messageId === 0) {
      return true;
    }
    if (messageFinderDown) {

      if (messageFinderUp) {

        if (message.fromUserId !== messageFinderUp.fromUserId && message.fromUserId !== messageFinderDown.fromUserId) {
          return true;
        }
      }
      if (message.fromUserId === messageFinderDown.fromUserId) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  checkCurrentMessage(singleMessage: privMessageData): boolean {
    if (singleMessage.fromUserId === this.currentUser.id) {
      return true;
    } else {
      return false;
    }
  }
  enableChat(singleChat: privMessageData[]) {
    this.userChat = true;
    this.newChat = false;
    this.currentMessages = new Array();
    let singleChatMessageTemp: privMessageData = { messageId: 0, fromUserId: 0, toUserId: 0, date: '23.07.2020 10:36', message: 'Hello world' };
    for (let i = 0; i < singleChat.length; i++) {
      singleChatMessageTemp.messageId = i;
      singleChatMessageTemp.fromUserId = singleChat[i].fromUserId;
      singleChatMessageTemp.toUserId = singleChat[i].toUserId;
      singleChatMessageTemp.date = singleChat[i].date;
      singleChatMessageTemp.message = singleChat[i].message;
      this.currentMessages.push(Object.assign({}, singleChatMessageTemp));
    }
    console.log('curr msg', this.currentMessages);
    this.currentMessages.reverse();
    console.log('curr msg rev', this.currentMessages);
    if (singleChat[0].fromUserId !== this.currentUser.id) {
      this.secUserMain = this.users.find(x => x.id === singleChat[0].fromUserId);
    } else {
      this.secUserMain = this.users.find(x => x.id === singleChat[0].toUserId);
    }
  }
  checkSecUserAvatar(secUser: userData): boolean {
    if (secUser) {
      if (secUser.avatar) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkSecUserLogged(secUser: userData): boolean {
    if (secUser) {
      if (secUser.logged) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  createUserIdentifier() {
    let privateMessageDataTemp;
    if (this.privateMessages) {
      privateMessageDataTemp = this.privateMessages.reverse();
    }
    let singleIdentifier;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < privateMessageDataTemp.length; i++) {
      if (privateMessageDataTemp[i].fromUserId === this.currentUser.id || privateMessageDataTemp[i].toUserId === this.currentUser.id) {
        singleIdentifier = '';
        if (privateMessageDataTemp[i].fromUserId === this.currentUser.id) {
          singleIdentifier += this.currentUser.id.toString();
          singleIdentifier += '-';
          singleIdentifier += privateMessageDataTemp[i].toUserId.toString();
          const userIdentifierFinder = this.userIdentifier.find(x => x === singleIdentifier);
          if (userIdentifierFinder === undefined) {
            this.userIdentifier.push(singleIdentifier);
          }
        }
        if (privateMessageDataTemp[i].toUserId === this.currentUser.id) {
          singleIdentifier += this.currentUser.id.toString();
          singleIdentifier += '-';
          singleIdentifier += privateMessageDataTemp[i].fromUserId.toString();
          const userIdentifierFinder = this.userIdentifier.find(x => x === singleIdentifier);
          if (userIdentifierFinder === undefined) {
            this.userIdentifier.push(singleIdentifier);
          }
        }
      }
    }
  }
  createChat() {
    this.userChatMessages = new Array();
    let singleChat: privMessageData[] = [];
    const privateMessageDataTemp = this.privateMessages.reverse();
    let singleChatMessage: privMessageData = { messageId: 0, fromUserId: 0, toUserId: 0, date: '24.07.2020 14:36', message: 'heleloo' };
    const currUserID = Number(this.userIdentifier[0].split('-', 1));
    console.log(currUserID);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.userIdentifier.length; i++) {
      let messageChatID = 0;
      const secUserIDsplit = this.userIdentifier[i].split('-', 2);
      const secUserID = Number(secUserIDsplit[1]);
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < privateMessageDataTemp.length; j++) {
        if (privateMessageDataTemp[j].fromUserId === currUserID && privateMessageDataTemp[j].toUserId === secUserID) {
          singleChatMessage.date = privateMessageDataTemp[j].date;
          singleChatMessage.fromUserId = privateMessageDataTemp[j].fromUserId;
          singleChatMessage.toUserId = privateMessageDataTemp[j].toUserId;
          singleChatMessage.message = privateMessageDataTemp[j].message;
          singleChatMessage.messageId = messageChatID;
          messageChatID++;
          singleChat.push(Object.assign({}, singleChatMessage));
        } else if (privateMessageDataTemp[j].fromUserId === secUserID && privateMessageDataTemp[j].toUserId === currUserID) {
          singleChatMessage.date = privateMessageDataTemp[j].date;
          singleChatMessage.fromUserId = privateMessageDataTemp[j].fromUserId;
          singleChatMessage.toUserId = privateMessageDataTemp[j].toUserId;
          singleChatMessage.message = privateMessageDataTemp[j].message;
          singleChatMessage.messageId = messageChatID;
          messageChatID++;
          singleChat.push(Object.assign({}, singleChatMessage));
          messageChatID++;
        }
      }
      this.userChatMessages.push(singleChat);
      singleChat = [];
    }
  }
  getLastMessage(chat: privMessageData[]): string {
    const lastMessageID = chat.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    const lastMessage = chat.find(x => x.messageId === lastMessageID);
    if (lastMessage.message.length >= 20) {
      return lastMessage.message.substring(0, 20) + '...';
    } else {
      return lastMessage.message;
    }
  }
  getLastMessageDate(chat: privMessageData[]): string {
    const lastMessageID = chat.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    const lastMessage = chat.find(x => x.messageId === lastMessageID);
    return lastMessage.date.substring(0, 5);
  }
  getLastMessageTime(chat: privMessageData[]): string {
    const lastMessageID = chat.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    const lastMessage = chat.find(x => x.messageId === lastMessageID);
    return lastMessage.date.substring(11, 16);
  }
  checkLastMessage(chat: privMessageData[]): boolean {
    const lastMessageID = chat.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
    const lastMessage = chat.find(x => x.messageId === lastMessageID);
    if (lastMessage.fromUserId === this.currentUser.id) {
      return true;
    } else {
      return false;
    }
  }
  getLastOnlineDate(): string {
    if (this.newChat) {
      if (this.newUserMain) {
        return this.newUserMain.lastOnline.substring(0, 10) + ', at ' + this.newUserMain.lastOnline.substring(11, 16);
      }
      return '';
    } else {
      if (this.secUserMain) {
        return this.secUserMain.lastOnline.substring(0, 10) + ', at ' + this.secUserMain.lastOnline.substring(11, 16);
      }
      return '';
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
      return false;
    }
  }

  createDate(localeDate: string, localeTime: string): string {
    const localeTimeShort = localeTime.substring(0, 5);
    return localeDate + ' ' + localeTimeShort;
  }
  onNoClick(): void {
    this.dialog.close();
  }
}

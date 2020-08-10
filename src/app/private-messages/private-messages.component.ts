import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';
import { userData } from '../userData';
import { privMessageData } from '../messageData';
import { single, find } from 'rxjs/operators';
import { TooltipPosition } from '@angular/material/tooltip';
import { privateMessageService } from '../_services/private-messages.service';
import { FormControl, Validators } from '@angular/forms';
import { userChatMessagesService } from '../_services/userChat.service';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrls: ['./private-messages.component.scss']
})
export class PrivateMessagesComponent implements OnInit {
  @Input()
  username = '';

  privateMessages: privMessageData[];
  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  messagesCounter = 0;
  userIdentifier: string[] = new Array();

  constructor(public privMessageService: privateMessageService, public dialog: MatDialog, public userService: userSourceService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.username);
    });
    this.privMessageService.getPrivateMessages().subscribe(privateMessages => {
      this.privateMessages = privateMessages;
      this.createUserIdentifier();
      this.messagesCounter = this.userIdentifier.length;
    });

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
  newChatContinue = false;
  getChat = false;
  usernameFormControl = new FormControl('', [Validators.required]);

  // tslint:disable-next-line: max-line-length
  constructor(public userChatService: userChatMessagesService, public dialog: MatDialogRef<privateMessagesDialog>, @Inject(MAT_DIALOG_DATA) public username: string, public userService: userSourceService, public privMessageService: privateMessageService) {

  }

  ngOnInit() {
    this.currentUsername = JSON.stringify(this.username).substring(13, (JSON.stringify(this.username).length - 2));
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.currentUsername);
    });
    this.privMessageService.getPrivateMessages().subscribe(privateMessages => {
      this.privateMessages = privateMessages;
      this.createUserIdentifier();
      if (!this.getChat) {
        this.createChat();
      }
    });
    if (this.getChat) {
      this.userChatService.mainUserChatMessages.subscribe(msg => {
        this.userChatMessages = msg;
      });
    }

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
      let index;
      for (let i = 0; i < this.userChatMessages.length; i++) {
        if (this.compareArrays(this.userChatMessages[i], this.reverseArray(this.currentMessages))) {
          index = i;
        }
      }
      const temp = [...this.userChatMessages];
      this.currentMessages.unshift(Object.assign({}, messageToSend));

      if (this.newChatContinue) {
        temp.splice(index, 1);
        this.currentMessages = this.reverseArray(this.currentMessages);
        temp.unshift(this.currentMessages);
        this.currentMessages = this.reverseArray(this.currentMessages);
      } else if (this.newChat) {
        this.currentMessages = this.reverseArray(this.currentMessages);
        temp.unshift(this.currentMessages);
        this.currentMessages = this.reverseArray(this.currentMessages);
        this.newChatContinue = true;

      } else {
        this.newChatContinue = false;
        temp.splice(index, 1);
        this.currentMessages = this.reverseArray(this.currentMessages);
        temp.unshift(this.currentMessages);
        this.currentMessages = this.reverseArray(this.currentMessages);


      }
      this.userChatMessages = temp;
      this.userChatService.changeChatProperties(this.userChatMessages);
      this.getChat = true;
      this.ngOnInit();
    }

    this.inputPrivMessage = '';
  }

  reverseArray(arr) {
    const rev = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      rev.push(arr[i])
    }
    return rev;
  }
  compareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length - 1; i++) {
      if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
        return false;
      }
    }
    return true;

  }
  changeStatus() {
    this.newMessageBool = true;
  }
  secUsersID = (): string[] => {
    let userID;
    let usersID: string[] = new Array();
    for (let i = 0; i < this.userIdentifier.length; i++) {
      userID = this.userIdentifier[i].split('-', 2);
      usersID.push(userID[1]);
    }
    return usersID;
  };
  newMessage() {
    const findUser = this.users.find(user => user.username === this.searchUserInput);
    // const secUserIDsplit = this.userIdentifier[i].split('-', 2);
    const secUsersID = this.secUsersID();
    if (!findUser) {
      this.usernameFormControl.setErrors({ 'noResult': true });
    }
    else if (findUser.id === this.currentUser.id) {
      this.usernameFormControl.setErrors({ 'sameUser': true });
    }
    else if (secUsersID.find(x => Number(x) === findUser.id)) {
      this.usernameFormControl.setErrors({ 'userInChat': true });
    }
    else if (findUser) {
      this.newUserMain = findUser;
      this.userChat = false;
      this.newChatContinue = false;
      this.newChat = true;
      this.newMessageBool = false;
      this.currentMessages = new Array();
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
    this.newChatContinue = false;
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
    this.currentMessages.reverse();
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
    let lastMessageID;
    let lastMessage;
    if (chat) {
      lastMessageID = chat.reduce((a, b) => a.messageId > b.messageId ? a : b).messageId;
      lastMessage = chat.find(x => x.messageId === lastMessageID);
      if (lastMessage.fromUserId === this.currentUser.id) {
        return true;
      } else {
        return false;
      }
    }

  }
  getLastOnlineDate(): string {
    if (this.newChat) {
      if (this.newUserMain) {
        return this.newUserMain.lastOnline.substring(0, 10) + ', at ' + this.newUserMain.lastOnline.substring(11, 16);
      }
      return '';
    } else {
      if (this.secUserMain.lastOnline) {
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
    this.getChat = false;

  }
}

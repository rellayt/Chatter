import { Component, OnInit, Input } from '@angular/core';
import { messageData } from '../messageData';
import { userSourceService } from '../_services/users.service';
import { userData } from '../login/validation.component';
import { avatarService } from '../_services/avatar.service';
import { publicMessageService } from '../_services/public-messages-one';

@Component({
  selector: 'app-public-channel-one',
  templateUrl: './public-channel-one.component.html',
  styleUrls: ['./public-channel-one.component.scss']
})
export class PublicChannelOneComponent implements OnInit {

  @Input()
  username: string;

  date = new Date();
  firstMessage: messageData = new messageData(0, 1, 0, '21.07.2020 12:05', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has');
  secondMessage: messageData = new messageData(1, 1, 1, '22.07.2020 13:01', 'Hello');
  thirdMessage: messageData = new messageData(2, 1, 2, '22.07.2020 14:08', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has');
  channelOneMessages: messageData[] = [this.firstMessage, this.secondMessage, this.thirdMessage];
  tempMessage: messageData;
  inputMessage: string;


  publicMessagesStorage: messageData[];
  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  tempUser: userData = { id: null, username: '', password: '', logged: false };

  constructor(public userService: userSourceService, public avatars: avatarService, public publicMessages: publicMessageService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.username);
    });
    this.publicMessages.getPublicMessages().subscribe(messages => {
      this.publicMessagesStorage = messages;
      console.log('test', this.publicMessagesStorage);
      console.log('test2', this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString()));
    });
  }
  sendMessage() {
    console.log(this.inputMessage);
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
      return this.tempMessage.date;
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
}

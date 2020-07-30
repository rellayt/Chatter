import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { privMessageData } from '../messageData';

@Injectable()

export class userChatMessagesService {
  userChatMessages: privMessageData[][] = new Array();
  private userChatMessagesSource = new BehaviorSubject<privMessageData[][]>(this.userChatMessages);
  mainUserChatMessages = this.userChatMessagesSource.asObservable();

  changeChatProperties(userChatMessages: privMessageData[][]) {
    this.userChatMessagesSource.next(userChatMessages);
  }
}

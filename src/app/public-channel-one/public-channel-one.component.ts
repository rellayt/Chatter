import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-public-channel-one',
  templateUrl: './public-channel-one.component.html',
  styleUrls: ['./public-channel-one.component.scss']
})
export class PublicChannelOneComponent implements OnInit {

  date = new Date();
  firstMessage: publicMessageData = new publicMessageData(0, 1, 0, this.date, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has');
  secondMessage: publicMessageData = new publicMessageData(1, 1, 1, this.date, 'Hello');
  channelOneMessages: publicMessageData[] = [this.firstMessage, this.secondMessage];

  constructor() { }

  ngOnInit(): void {

  }

}

export class publicMessageData {
  constructor(public messageId: number, public channelId: number, public userId: number, public date: Date, public message: string) {
  }
}

export class messageData {
  constructor(public messageId: number, public channelId: number, public userId: number, public date: string, public message: string, public image?: string, public idSource?: string) {
  }
}

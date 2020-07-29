export class messageData {
  constructor(public messageId: number, public channelId: number, public userId: number, public date: string, public message: string, public image?: string, public fileUrl?: string, public fileName?: string, public idSource?: string) {
  }
}
export class privMessageData {
  constructor(public messageId: number, public fromUserId: number, public toUserId: number, public date: string, public message: string, public idSource?: string) {
  }
}

export class userData {
  // tslint:disable-next-line: max-line-length
  constructor(public id: number, public username: string, public password: string, public logged = false, public idSource?: string, public avatar?: string, public registeredDate?: string, public messagesCount?: number) {
  }
}

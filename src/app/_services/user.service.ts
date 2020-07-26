import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { userData } from '../userData';

@Injectable()

export class userService {
  userTemp: userData = { id: null, username: '', password: '', logged: false };
  private userSource = new BehaviorSubject<userData>(this.userTemp);
  currentUser = this.userSource.asObservable();

  changeUserProperties(user: userData) {
    this.userSource.next(user);
  }
}

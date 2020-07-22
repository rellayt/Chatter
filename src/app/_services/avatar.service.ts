import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';
import { userData } from '../login/validation.component';
import { userSourceService } from './users.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class avatarService {
  avatarTemp: string = '';
  private avatarSource = new BehaviorSubject<string>(this.avatarTemp);
  currentAvatar = this.avatarSource.asObservable();

  constructor(public afs: AngularFirestore, public db: AngularFireDatabase, public userService: userSourceService) {
    firebase.initializeApp(environment.firebase);
    this.changeAvatarProperties('');
  }
  putImage(file: File, user: userData) {
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/avatars/${user.id}`);
    storageRef.put(file);
  }
  getImage(user: userData) {
    let avatarURL = '';
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/avatars/${user.id}`);

    if (storageRef.getDownloadURL()) {
      const downloadURL = storageRef.getDownloadURL();
      downloadURL.then(url => {
        if (url) {
          avatarURL = url;
          console.log('AVATAR URL: ', avatarURL);
          this.changeAvatarProperties(avatarURL);
        }
      });
    }
  }
  changeAvatarProperties(avatarURL: string) {
    this.avatarSource.next(avatarURL);
  }
}


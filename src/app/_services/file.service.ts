import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';
import { userData } from '../login/validation.component';
import { userSourceService } from './users.service';
import { BehaviorSubject } from 'rxjs';
import { messageData } from '../messageData';

@Injectable({
  providedIn: 'root'
})
export class fileService {
  Test: string = '';
  private avatarSource = new BehaviorSubject<string>(this.Test);
  currentAvatar = this.avatarSource.asObservable();

  private imageSource = new BehaviorSubject<string>(this.Test);
  currentImage = this.imageSource.asObservable();

  constructor(public afs: AngularFirestore, public db: AngularFireDatabase, public userService: userSourceService) {
    firebase.initializeApp(environment.firebase);
    this.changeAvatarProperties('');
    //this.changeImageProperties('');
  }
  putAvatar(file: File, user: userData) {
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/avatars/${user.id}`);
    storageRef.put(file);
  }
  getAvatar(user: userData) {
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

  // putImage(file: File, message: messageData) {
  //   const storageRef: firebase.storage.Reference = firebase.storage().ref(`/images/${message.messageId}`);
  //   storageRef.put(file);
  // }
  // getImage(message: messageData) {
  //   let imageURL = '';
  //   const storageRef: firebase.storage.Reference = firebase.storage().ref(`/images/${message.messageId}`);

  //   if (storageRef.getDownloadURL()) {
  //     const downloadURL = storageRef.getDownloadURL();
  //     downloadURL.then(url => {
  //       if (url) {
  //         imageURL = url;
  //         console.log('imageURL: ', imageURL);
  //         this.changeImageProperties(imageURL);
  //       }
  //     });
  //   }
  // }
  // changeImageProperties(avatarURL: string) {
  //   this.imageSource.next(avatarURL);
  // }
}


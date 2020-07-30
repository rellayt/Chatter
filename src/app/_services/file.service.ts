import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from 'angularfire2/firestore';
import { userData } from '../userData';
import { userSourceService } from './users.service';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class fileService {
  Test: string = '';
  private avatarSource = new BehaviorSubject<string>(this.Test);
  currentAvatar = this.avatarSource.asObservable();

  private imageSource = new BehaviorSubject<string>(this.Test);
  currentImage = this.imageSource.asObservable();

  private fileSource = new BehaviorSubject<string>(this.Test);
  currentFile = this.fileSource.asObservable();

  constructor(public afs: AngularFirestore, public db: AngularFireDatabase, public userService: userSourceService) {
    firebase.initializeApp(environment.firebase);
    this.changeAvatarProperties('');
    // this.changeImageProperties('');
  }
  putAvatar(file: File, user: userData) {
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/avatars/${user.id}`);
    storageRef.put(file);
  }
  putImage(file: File, messageId: number, channelId: number) {
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/images/${channelId}/${messageId}`);
    storageRef.put(file);
  }
  putFile(file: File, messageId: number, channelId: number) {
    const fileName = file.name;

    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/files/${channelId}/${messageId}/${fileName}`);
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
          this.changeAvatarProperties(avatarURL);
        }
      });
    }
  }
  getImage(messageId: number, channelId: number) {
    let imageURL = '';
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/images/${channelId}/${messageId}`);

    if (storageRef.getDownloadURL()) {
      const downloadURL = storageRef.getDownloadURL();

      downloadURL.then(url => {
        if (url) {
          imageURL = url;
          this.changeImageProperties(imageURL);
        }
      });
    }
  }
  getFile(file: File, messageId: number, channelId: number) {
    const fileName = file.name;

    let fileURL = '';
    const storageRef: firebase.storage.Reference = firebase.storage().ref(`/files/${channelId}/${messageId}/${fileName}`);

    if (storageRef.getDownloadURL()) {
      const downloadURL = storageRef.getDownloadURL();
      downloadURL.then(url => {
        if (url) {
          fileURL = url;
          this.changeFileProperties(fileURL);
        }
      });
    }
  }
  changeAvatarProperties(avatarURL: string) {
    this.avatarSource.next(avatarURL);
  }
  changeImageProperties(imageURL: string) {
    this.imageSource.next(imageURL);
  }
  changeFileProperties(fileURL: string) {
    this.fileSource.next(fileURL);
  }

}


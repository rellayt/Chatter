import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { messageData } from '../messageData';

@Injectable({
  providedIn: 'root'
})
export class publicMessageService {
  publicMessagesCollection: AngularFirestoreCollection<messageData>;
  publicMessages: Observable<messageData[]>;
  publicMessagesDoc: AngularFirestoreDocument<messageData>;

  constructor(public afs: AngularFirestore) {
    this.publicMessagesCollection = this.afs.collection('public_messages', ref => ref.orderBy('messageId', 'asc'));

    this.publicMessages = this.publicMessagesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as messageData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getPublicMessages() {
    return this.publicMessages;
  }
  addPublicMessage(message: messageData) {
    this.publicMessagesCollection.add(JSON.parse(JSON.stringify(message)));
  }
  // changeUserStatus(user: userData) {
  //   user = JSON.parse(JSON.stringify(user));
  //   this.userDoc = this.afs.doc(`users/${user.idSource}`)
  //   this.userDoc.update(user);
  // }
}

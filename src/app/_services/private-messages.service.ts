import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { privMessageData } from '../messageData';

@Injectable({
  providedIn: 'root'
})
export class privateMessageService {
  privateMessagesCollection: AngularFirestoreCollection<privMessageData>;
  privateMessages: Observable<privMessageData[]>;
  publicMessagesDoc: AngularFirestoreDocument<privMessageData>;

  constructor(public afs: AngularFirestore) {
    this.privateMessagesCollection = this.afs.collection('private_messages', ref => ref.orderBy('messageId', 'asc'));

    this.privateMessages = this.privateMessagesCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as privMessageData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getPrivateMessages() {
    return this.privateMessages;
  }
  addPrivateMessage(message: privMessageData) {
    this.privateMessagesCollection.add(JSON.parse(JSON.stringify(message)));
  }

}

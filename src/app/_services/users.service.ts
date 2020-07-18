import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { userData } from '../login/validation.component';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class userSourceService {
  usersCollection: AngularFirestoreCollection<userData>;
  users: Observable<userData[]>;
  userDoc: AngularFirestoreDocument<userData>;

  constructor(public afs: AngularFirestore) {
    this.usersCollection = this.afs.collection('users', ref => ref.orderBy('id', 'asc'));

    this.users = this.usersCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as userData;
        data.idSource = a.payload.doc.id;
        return data;
      });
    }));
  }
  getUsers() {
    return this.users;
  }
  addUsers(user: userData) {
    this.usersCollection.add(JSON.parse(JSON.stringify(user)));
  }
  changeUserStatus(user: userData) {
    user = JSON.parse(JSON.stringify(user));
    this.userDoc = this.afs.doc(`users/${user.idSource}`)
    this.userDoc.update(user);
  }
}

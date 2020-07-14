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

  constructor(public afs: AngularFirestore) {
    //this.users = this.afs.collection('users').valueChanges();
    this.usersCollection = this.afs.collection('users');

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
}

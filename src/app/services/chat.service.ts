import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './auth.service';
import firebase from 'firebase/compat/app';

export interface Message {
  id?: string;
  text: string;
  userId: string;
  userEmail: string;
  timestamp: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesCollection;

  constructor(private firestore: AngularFirestore) {
    this.messagesCollection = this.firestore.collection<Message>('messages');
  }

  getMessages(): Observable<Message[]> {
    return this.messagesCollection
      .valueChanges({ idField: 'id' })
      .pipe(
        map(messages => messages.sort((a, b) => 
          a.timestamp?.seconds - b.timestamp?.seconds
        ))
      );
  }

  async sendMessage(text: string, user: User) {
    const message: Omit<Message, 'id'> = {
      text,
      userId: user.uid,
      userEmail: user.email,
      timestamp: firebase.firestore.Timestamp.now()
    };

    return this.messagesCollection.add(message);
  }
}

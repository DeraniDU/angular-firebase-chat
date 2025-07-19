import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, User } from './auth.service';

export interface Message {
  id?: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesCollection;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {
    this.messagesCollection = this.afs.collection('messages');
  }

  // Removed duplicate constructor

  getMessages(): Observable<Message[]> {
    return this.messagesCollection
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Message;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  async sendMessage(text: string, user: User) {
    const message: Omit<Message, 'id'> = {
      text,
      userId: user.uid,
      userName: user.displayName || user.email,
      userPhoto: user.photoURL || '',
      timestamp: new Date()
    };

    try {
      await this.messagesCollection.add(message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

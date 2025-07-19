import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      map(user => user ? {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined
      } : null)
    );
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}

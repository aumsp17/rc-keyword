import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

import { User } from '../shared/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userRef$: Observable<AngularFirestoreDocument<User>>;
  user$: Observable<User>;
  loaded = false;


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.afAuth.onAuthStateChanged(user => {
      this.loaded = true;
    });
    this.afAuth.getRedirectResult().then(credential => {
      if(credential.user) {
        this.updateUserData(credential.user);
      }
    })
  }

  googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'docchula.com',
      prompt: 'select_account'
    });
    return this.oAuthLogin(provider)
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithRedirect(provider)
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  private updateUserData(user: firebase.User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      roles: {
        user: true
      }
    }
    return userRef.set(data, { merge: true }).then(() => {
      this.router.navigate(['/'])
    })
  }

  checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    if (!allowedRoles) return true
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false
  }
}

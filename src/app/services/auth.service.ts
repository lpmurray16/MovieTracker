import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private authInitialized = false;

  constructor(private auth: Auth) {
    // Enable persistence
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase persistence enabled');
      })
      .catch((error) => {
        console.error('Error enabling persistence:', error);
      });

    // Subscribe to auth state changes
    this.auth.onAuthStateChanged(user => {
      this.user = user;
      this.userSubject.next(user);
      this.authInitialized = true;
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
    });
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  signOut() {
    return this.auth.signOut();
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }
  
  isAuthInitialized(): boolean {
    return this.authInitialized;
  }
}
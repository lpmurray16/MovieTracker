import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, filter } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean | any>((resolve) => {
    // Wait for Firebase to initialize auth state from local storage
    // by using filter to wait until authState is no longer in its initial loading state
    const subscription = authService.user$
      .pipe(
        // Wait for Firebase Auth to complete initialization
        filter(user => user !== null || authService.isAuthInitialized()),
        take(1)
      )
      .subscribe(user => {
        if (user) {
          resolve(true);
        } else {
          resolve(router.parseUrl('/login'));
        }
      });
  });
};
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertMessage | null>(null);
  public alert$: Observable<AlertMessage | null> = this.alertSubject.asObservable();
  
  // Default duration for alerts in milliseconds
  private defaultDuration = 3000;

  constructor() {}

  /**
   * Show a success toast message
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showSuccess(message: string, duration?: number): void {
    this.show({
      type: 'success',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show an error toast message
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showError(message: string, duration?: number): void {
    this.show({
      type: 'error',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show an info toast message
   * @param message The message to display
   * @param duration Optional duration in milliseconds
   */
  showInfo(message: string, duration?: number): void {
    this.show({
      type: 'info',
      message,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Show a toast message
   * @param alert The alert message object
   */
  private show(alert: AlertMessage): void {
    this.alertSubject.next(alert);
    
    // Auto-dismiss the alert after the specified duration
    if (alert.duration) {
      setTimeout(() => {
        // Only clear if this is still the current alert
        if (this.alertSubject.value === alert) {
          this.clear();
        }
      }, alert.duration);
    }
  }

  /**
   * Clear the current alert
   */
  clear(): void {
    this.alertSubject.next(null);
  }
}
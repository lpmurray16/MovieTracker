import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, AlertMessage } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert" 
         class="toast toast-bottom z-50 transition-all duration-300">
      <div class="alert" [ngClass]="{
        'alert-success bg-success text-success-content': alert.type === 'success',
        'alert-error bg-error text-error-content': alert.type === 'error',
        'alert-info bg-info text-info-content': alert.type === 'info'
      }">
        <span>{{ alert.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 300px;
    }
    
    @media (max-width: 768px) {
      .toast {
        bottom: 80px; /* Raised higher on mobile to avoid bottom navigation */
      }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: AlertMessage | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
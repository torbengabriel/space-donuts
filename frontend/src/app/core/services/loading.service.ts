import { Injectable, signal } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = 0;
  private hideSubscription?: Subscription;

  isLoading = signal(false);

  show(): void {
    this.hideSubscription?.unsubscribe();

    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    if (this.activeRequests === 0) {
      this.hideSubscription = timer(500).subscribe(() => {
        this.isLoading.set(false);
      });
    }
  }
}

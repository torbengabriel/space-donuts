import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { CartButton } from './features/cart/components/cart-button/cart-button';
import { LoadingSpinnerComponent } from './core/components/loading-spinner/loading-spinner';
import { OverlayContainer } from './shared/overlays/overlay-container/overlay-container';
import { OverlayStore } from './core/overlay/overlay.store';
import { NotificationToast } from './features/notifications/components/notification-toast/notification-toast';
import { NotificationStore } from './features/notifications/store/notification.store';

@Component({
  imports: [
    RouterOutlet,
    Header,
    CartButton,
    LoadingSpinnerComponent,
    OverlayContainer,
    NotificationToast,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  public readonly notificationStore = inject(NotificationStore);

  protected readonly overlayStore = inject(OverlayStore);
  protected readonly showStickyCart = signal(false);

  private readonly header = viewChild.required('headerElement', { read: ElementRef<HTMLElement> });
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => {
        this.showStickyCart.set(!entry.isIntersecting);
      });
      observer.observe(this.header().nativeElement);

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

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
import { Header } from './header/header';
import { CartButton } from './cart/cart-button/cart-button';
import { LoadingSpinnerComponent } from './core/components/loading-spinner/loading-spinner';
import { OverlayContainer } from './shared/overlays/overlay-container/overlay-container';
import { OverlayStore } from './core/overlay/overlay.store';

@Component({
  imports: [
    RouterOutlet,
    Header,
    CartButton,
    LoadingSpinnerComponent,
    OverlayContainer,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
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

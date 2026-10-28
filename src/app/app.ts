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
import { DonutList } from './donuts/donut-list/donut-list';
import { Header } from './header/header';
import { CartButton } from './cart/cart-button/cart-button';
import { CartOverlay } from './cart/cart-overlay/cart-overlay';
import { CartStore } from './cart/cart.store';

@Component({
  imports: [RouterOutlet, DonutList, Header, CartButton, CartOverlay],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly cartStore = inject(CartStore);
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

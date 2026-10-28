import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
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
})
export class App implements AfterViewInit, OnDestroy {
  readonly cartStore = inject(CartStore);

  @ViewChild('headerElement', { read: ElementRef })
  headerElement!: ElementRef<HTMLElement>;

  readonly showStickyCart = signal(false);

  private observer?: IntersectionObserver;

  public ngAfterViewInit(): void {
    // Observe the header to detect when it leaves the viewport.
    // ViewChild is available here because the view has been initialized.
    this.observer = new IntersectionObserver(([entry]) => {
      // Show the sticky cart button when the header is no longer visible.
      console.log('HIER ', !entry.isIntersecting);
      this.showStickyCart.set(!entry.isIntersecting);
    });

    this.observer.observe(this.headerElement.nativeElement);
  }

  public ngOnDestroy(): void {
    // Disconnect the observer when the component is destroyed
    // to prevent unnecessary observation and resource usage.
    this.observer?.disconnect();
  }
}

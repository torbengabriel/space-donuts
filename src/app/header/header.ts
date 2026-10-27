import { Component, inject, signal } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';
import { Overlay } from '../shared/overlay/overlay';
import { CartStore } from '../cart/cart.store';

@Component({
  imports: [LucideShoppingCart, Overlay],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly cartStore = inject(CartStore);

  readonly isCartOpen = signal(false);
}

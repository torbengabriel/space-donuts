import { Component, inject } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { CartButton } from '../cart/cart-button/cart-button';

@Component({
  imports: [CartButton],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly cartStore = inject(CartStore);
}

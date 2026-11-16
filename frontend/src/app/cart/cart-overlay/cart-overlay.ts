import { Component, inject } from '@angular/core';
import { CartStore } from '../cart.store';
import { CurrencyPipe } from '@angular/common';
import { CartLine } from './cart-line/cart-line';

@Component({
  imports: [CurrencyPipe, CartLine],
  selector: 'app-cart-overlay',
  styleUrl: './cart-overlay.scss',
  templateUrl: './cart-overlay.html',
})
export class CartOverlay {
  protected readonly cartStore = inject(CartStore);
}

import { Component, inject, output } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';
import { CartStore } from '../cart.store';
import { CountBadge } from '../../shared/count-badge/count-badge';

@Component({
  imports: [LucideShoppingCart, CountBadge],
  selector: 'app-cart-button',
  styleUrl: './cart-button.scss',
  templateUrl: './cart-button.html',
})
export class CartButton {
  readonly cartStore = inject(CartStore);

  readonly clicked = output<void>();
}

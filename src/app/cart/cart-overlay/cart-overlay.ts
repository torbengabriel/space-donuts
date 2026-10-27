import { Component, computed, inject, input, output } from '@angular/core';
import { Overlay } from '../../shared/overlay/overlay';
import { CartStore } from '../cart.store';
import { CurrencyPipe } from '@angular/common';
import { QuantitySelector } from '../../shared/quantity-selector/quantity-selector';

@Component({
  imports: [Overlay, CurrencyPipe, QuantitySelector],
  selector: 'app-cart-overlay',
  styleUrl: './cart-overlay.scss',
  templateUrl: './cart-overlay.html',
})
export class CartOverlay {
  readonly cartStore = inject(CartStore);

  readonly open = input.required<boolean>();
  readonly closed = output<void>();

  readonly totalPrice = computed(() => this.cartStore.items().reduce((acc, item) => {
      return acc + item.donut.price * item.quantity;
    }, 0)
  );
}

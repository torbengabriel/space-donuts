import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { QuantitySelector } from '../../../shared/quantity-selector/quantity-selector';
import { CartItem } from '../../cart-item.model';

@Component({
  imports: [CurrencyPipe, QuantitySelector],
  selector: 'app-cart-line',
  styleUrl: './cart-line.scss',
  templateUrl: './cart-line.html',
})
export class CartLine {
  readonly item = input.required<CartItem>();

  protected readonly itemTotalPrice = computed(
    () => this.item().donut.price * this.item().quantity,
  );

  readonly quantityIncreased = output<void>();
  readonly quantityDecreased = output<void>();
}

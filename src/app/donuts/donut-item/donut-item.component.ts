import { Component, computed, inject, input } from '@angular/core';

import { Donut } from '../models/donut.model';
import { CurrencyPipe } from '@angular/common';
import { LucideShoppingCart } from '@lucide/angular';
import { CartStore } from '../../cart/cart.store';
import { QuantitySelector } from '../../shared/quantity-selector/quantity-selector';

@Component({
  selector: 'app-donut-item',
  templateUrl: './donut-item.component.html',
  styleUrl: './donut-item.component.scss',
  imports: [CurrencyPipe, LucideShoppingCart, QuantitySelector],
})
export class DonutItemComponent {
  readonly donut = input.required<Donut>();

  readonly cartStore = inject(CartStore);

  protected readonly quantity = computed(
    () => this.cartStore.items().find((item) => item.donut.id === this.donut().id)?.quantity ?? 0,
  );
}

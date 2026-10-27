import { Component, computed, inject, input } from '@angular/core';

import { Donut } from '../models/donut.model';
import { CurrencyPipe } from '@angular/common';
import { LucideShoppingCart } from '@lucide/angular';
import { CartStore } from '../../cart/cart.store';
import { QuantitySelector } from '../../shared/quantity-selector/quantity-selector';

@Component({
  selector: 'app-donut-item',
  templateUrl: './donut-item.html',
  styleUrl: './donut-item.scss',
  imports: [CurrencyPipe, LucideShoppingCart, QuantitySelector],
})
export class DonutItem {
  readonly donut = input.required<Donut>();

  readonly cartStore = inject(CartStore);

  readonly quantity = computed(
    () => this.cartStore.items().find((item) => item.donut.id === this.donut().id)?.quantity ?? 0,
  );

  public addToCart(): void {
    this.cartStore.addDonut(this.donut());
  }

  public onQuantityChange(quantity: number): void {
    if (quantity > this.quantity()) {
      this.cartStore.increaseQuantity(this.donut().id);
    } else {
      this.cartStore.decreaseQuantity(this.donut().id);
    }
  }
}

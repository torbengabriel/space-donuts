import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';
import { QuantitySelector } from '../../shared/quantity-selector/quantity-selector';
import { Donut } from '../../donuts/donut.model';
import { CartStore } from '../cart.store';

@Component({
  selector: 'app-add-to-cart',
  imports: [LucideShoppingCart, QuantitySelector],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCart {
  readonly donut = input.required<Donut>();

  protected readonly cartStore = inject(CartStore);

  protected readonly quantity = computed(
    () => this.cartStore.items().find((item) => item.donut.id === this.donut().id)?.quantity ?? 0,
  );
}

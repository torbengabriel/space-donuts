import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';
import { QuantitySelector } from '../../shared/quantity-selector/quantity-selector';
import { Product } from '../../products/product.model';
import { CartStore } from '../cart.store';

@Component({
  selector: 'app-add-to-cart',
  imports: [LucideShoppingCart, QuantitySelector],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCart {
  readonly product = input.required<Product>();

  protected readonly cartStore = inject(CartStore);

  protected readonly quantity = computed(
    () => this.cartStore.items().find((item) => item.product.id === this.product().id)?.quantity ?? 0,
  );
}

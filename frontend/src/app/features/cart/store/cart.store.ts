import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { firstValueFrom } from 'rxjs';

interface CartState {
  items: CartItem[];
  cartId: number | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({
    items: [],
    cartId: null,
    status: 'idle',
  }),

  withComputed(({ items }) => ({
    totalQuantity: computed(() => items().reduce((total, item) => total + item.quantity, 0)),
    isEmpty: computed(() => items().length === 0),
    totalPrice: computed(() =>
      items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    ),
  })),

  withMethods((store, cartService = inject(CartService)) => ({
    async loadCart(): Promise<void> {
      patchState(store, { status: 'loading' });

      try {
        const cart = await firstValueFrom(
          cartService.getCart()
        );

        patchState(store, {
          cartId: cart.id,
          items: cart.items,
          status: 'loaded'
        });
      } catch (error) {
        console.error('Could not load cart', error);

        patchState(store, {
          status: 'error'
        });
      }
    },

    addProduct(product: Product): void {
      const existingItem = store.items().find((item) => item.product.id === product.id);

      if (existingItem) {
        patchState(store, {
          items: store
            .items()
            .map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
        });

        return;
      }

      patchState(store, {
        items: [...store.items(), { product, quantity: 1 }],
      });
    },

    increaseQuantity(donutId: number): void {
      patchState(store, {
        items: store
          .items()
          .map((item) =>
            item.product.id === donutId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
      });
    },

    decreaseQuantity(donutId: number): void {
      patchState(store, {
        items: store
          .items()
          .map((item) =>
            item.product.id === donutId ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      });
    },
  })),
);

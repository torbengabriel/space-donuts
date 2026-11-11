import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Product } from '../products/product.model';
import { CartItem } from './cart-item.model';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({
    items: [],
    isOpen: false,
  }),

  withComputed(({ items }) => ({
    totalQuantity: computed(() => items().reduce((total, item) => total + item.quantity, 0)),
    isEmpty: computed(() => items().length === 0),
    totalPrice: computed(() =>
      items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    ),
  })),

  withMethods((store) => ({
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

    openCart(): void {
      patchState(store, { isOpen: true });
    },

    closeCart(): void {
      patchState(store, { isOpen: false });
    },
  })),
);

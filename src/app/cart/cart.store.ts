import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Donut } from '../donuts/models/donut.model';
import { CartItem } from './cart-item.model';

interface CartState {
  items: CartItem[];
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({
    items: [],
  }),

  withComputed(({ items }) => ({
    totalQuantity: computed(() => items().reduce((total, item) => total + item.quantity, 0)),

    totalPrice: computed(() =>
      items().reduce((total, item) => total + item.donut.price * item.quantity, 0),
    ),
  })),

  withMethods((store) => ({
    addDonut(donut: Donut): void {
      const existingItem = store.items().find((item) => item.donut.id === donut.id);

      if (existingItem) {
        patchState(store, {
          items: store
            .items()
            .map((item) =>
              item.donut.id === donut.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
        });

        return;
      }

      patchState(store, {
        items: [...store.items(), { donut, quantity: 1 }],
      });
    },

    increaseQuantity(donutId: number): void {
      patchState(store, {
        items: store
          .items()
          .map((item) =>
            item.donut.id === donutId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
      });
    },

    decreaseQuantity(donutId: number): void {
      patchState(store, {
        items: store
          .items()
          .map((item) =>
            item.donut.id === donutId ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      });
    },
  })),
);

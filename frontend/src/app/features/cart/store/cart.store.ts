import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/cart-item.model';
import { CartApiService } from '../services/cart-api.service';
import { CartItemResponse, CartResponse } from '../models/cart.model';
import { AuthService } from '../../../core/auth/auth.service';
import { GuestCartService } from '../services/guest-cart.service';

interface CartState {
  items: CartItem[];
  cartId: number | null;
  status: 'idle' | 'loading' | 'loaded' | 'error';
  isGuestCart: boolean;
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState<CartState>({
    items: [],
    cartId: null,
    status: 'idle',
    isGuestCart: true,
  }),

  withComputed(({ items }) => ({
    totalQuantity: computed(() => items().reduce((total, item) => total + item.quantity, 0)),
    isEmpty: computed(() => items().length === 0),
    totalPrice: computed(() =>
      items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    ),
  })),

  withMethods(
    (
      store,
      cartApi = inject(CartApiService),
      guestCart = inject(GuestCartService),
      auth = inject(AuthService),
    ) => {

      const mapBackendItems = (items: CartItemResponse[]): CartItem[] =>
        items.map(item => ({
          product: {
            id: item.productId,
            name: item.productName,
            imageUrl: item.imageUrl,
            price: item.price
          } as Product,
          quantity: item.quantity
        }));

      return {
        loadCart(): void {
          if (auth.isLoggedIn) {
            const guestItems = guestCart.getCart();

            if (guestItems.length > 0) {
              this.mergeGuestCart();
            } else {
              this.loadBackendCart();
            }
          } else {
            this.loadGuestCart();
          }
        },

        loadGuestCart(): void {
          const items = guestCart.getCart();

          patchState(store, {
            items,
            cartId: null,
            isGuestCart: true,
            status: 'loaded'
          });
        },

        loadBackendCart(): void {
          cartApi.getCart().subscribe({
            next: (cart: CartResponse) => {
              patchState(store, {
                items: mapBackendItems(cart.items),
                cartId: cart.id,
                isGuestCart: false,
                status: 'loaded'
              });
            },
            error: () => patchState(store, { status: 'error' })
          });
        },

        addItem(product: Product): void {
          if (auth.isLoggedIn) {
            cartApi.addItem(product.id, 1).subscribe({
              next: (cart: CartResponse) => {
                patchState(store, {
                  items: mapBackendItems(cart.items),
                  cartId: cart.id,
                  isGuestCart: false,
                  status: 'loaded'
                });
              },
              error: () => patchState(store, { status: 'error' })
            });
          } else {
            const updatedItems = guestCart.addItem(product);

            patchState(store, {
              items: updatedItems,
              isGuestCart: true,
              status: 'loaded'
            });
          }
        },

        updateQuantity(productId: number, quantity: number): void {
          if (quantity < 1) {
            this.removeItem(productId);
            return;
          }

          if (auth.isLoggedIn) {
            const item = store.items().find(
              item => item.product.id === productId
            );

            if (!item?.product.id) {
              return;
            }

            cartApi.updateQuantity(item.product.id, quantity).subscribe({
              next: (cart: CartResponse) => {
                patchState(store, {
                  items: mapBackendItems(cart.items),
                  cartId: cart.id,
                  status: 'loaded'
                });
              },
              error: () => patchState(store, { status: 'error' })
            });
          } else {
            const updatedItems = guestCart.updateQuantity(productId, quantity);

            patchState(store, {
              items: updatedItems,
              status: 'loaded'
            });
          }
        },

        removeItem(productId: number): void {
          if (auth.isLoggedIn) {
            const item = store.items().find(
              item => item.product.id === productId
            );

            if (!item?.product.id) {
              return;
            }

            cartApi.removeItem(item.product.id).subscribe({
              next: (cart: CartResponse) => {
                patchState(store, {
                  items: mapBackendItems(cart.items),
                  cartId: cart.id,
                  isGuestCart: false,
                  status: 'loaded'
                });
              },
              error: () => patchState(store, { status: 'error' })
            });
          } else {
            const updatedItems = guestCart.removeItem(productId);

            patchState(store, {
              items: updatedItems,
              isGuestCart: true,
              status: 'loaded'
            });
          }
        },

        mergeGuestCart(): void {
          const guestItems = guestCart.getCart();

          if (guestItems.length === 0) {
            this.loadCart();
            return;
          }

          cartApi.mergeCart(guestItems).subscribe({
            next: (cart) => {
              patchState(store, {
                items: cart.items.map((item: CartItemResponse) => ({
                  product: {
                    id: item.id,
                    name: item.productName,
                    imageUrl: item.imageUrl,
                    price: item.price,
                  } as Product,
                  quantity: item.quantity,
                })),
                cartId: cart.id,
                isGuestCart: false,
                status: 'loaded',
              });

              guestCart.clearCart();
            },
            error: () => {
              patchState(store, { status: 'error' });
            },
          });
        },
      };
    },
  ),
);

import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CartStore } from './cart.store';
import { CartApiService } from '../services/cart-api.service';
import { GuestCartService } from '../services/guest-cart.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/cart-item.model';
import { CartResponse } from '../models/cart.model';

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  let cartApi: {
    getCart: ReturnType<typeof vi.fn>;
    addItem: ReturnType<typeof vi.fn>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    mergeCart: ReturnType<typeof vi.fn>;
  };

  let guestCart: {
    getCart: ReturnType<typeof vi.fn>;
    addItem: ReturnType<typeof vi.fn>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clearCart: ReturnType<typeof vi.fn>;
  };

  let auth: { isLoggedIn: boolean };

  const product1 = {
    id: 1,
    name: 'Chocolate Donut',
    price: 2.5,
  } as Product;

  const product2 = {
    id: 2,
    name: 'Vanilla Donut',
    price: 3.0,
  } as Product;

  const guestItems: CartItem[] = [
    { product: product1, quantity: 2 },
    { product: product2, quantity: 1 },
  ];

  const backendCart = (items: any[] = [], id = 100): CartResponse =>
    ({
      id,
      items,
    }) as CartResponse;

  const backendItems = [
    {
      id: 501,
      productId: 1,
      productName: 'Chocolate Donut',
      imageUrl: 'chocolate.jpg',
      price: 2.5,
      quantity: 2,
    },
    {
      id: 502,
      productId: 2,
      productName: 'Vanilla Donut',
      imageUrl: 'vanilla.jpg',
      price: 3,
      quantity: 1,
    },
  ];

  beforeEach(() => {
    cartApi = {
      getCart: vi.fn(),
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      mergeCart: vi.fn(),
    };

    guestCart = {
      getCart: vi.fn(),
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
    };

    auth = { isLoggedIn: false };

    TestBed.configureTestingModule({
      providers: [
        CartStore,
        { provide: CartApiService, useValue: cartApi },
        { provide: GuestCartService, useValue: guestCart },
        { provide: AuthService, useValue: auth },
      ],
    });

    store = TestBed.inject(CartStore);
  });

  describe('initial state', () => {
    it('should initialize with an empty cart', () => {
      expect(store.items()).toEqual([]);
      expect(store.cartId()).toBeNull();
      expect(store.status()).toBe('idle');
      expect(store.isGuestCart()).toBe(true);
    });

    it('should have totalQuantity equal to zero', () => {
      expect(store.totalQuantity()).toBe(0);
    });

    it('should have totalPrice equal to zero', () => {
      expect(store.totalPrice()).toBe(0);
    });

    it('should be empty', () => {
      expect(store.isEmpty()).toBe(true);
    });
  });

  describe('computed values', () => {
    it('should calculate total quantity', () => {
      guestCart.getCart.mockReturnValue(guestItems);

      store.loadGuestCart();

      expect(store.totalQuantity()).toBe(3);
    });

    it('should calculate total price', () => {
      guestCart.getCart.mockReturnValue(guestItems);

      store.loadGuestCart();

      expect(store.totalPrice()).toBe(8);
    });

    it('should return false for isEmpty when cart contains items', () => {
      guestCart.getCart.mockReturnValue(guestItems);

      store.loadGuestCart();

      expect(store.isEmpty()).toBe(false);
    });
  });

  describe('loadCart', () => {
    it('should load the guest cart when user is not logged in', () => {
      guestCart.getCart.mockReturnValue(guestItems);

      store.loadCart();

      expect(guestCart.getCart).toHaveBeenCalled();
      expect(store.items()).toEqual(guestItems);
      expect(store.isGuestCart()).toBe(true);
      expect(store.status()).toBe('loaded');
      expect(cartApi.getCart).not.toHaveBeenCalled();
    });

    it('should load the backend cart when logged in and guest cart is empty', () => {
      auth.isLoggedIn = true;
      guestCart.getCart.mockReturnValue([]);
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));

      store.loadCart();

      expect(cartApi.getCart).toHaveBeenCalled();
      expect(store.isGuestCart()).toBe(false);
      expect(store.status()).toBe('loaded');
      expect(store.cartId()).toBe(100);
      expect(store.items()).toHaveLength(2);
    });

    it('should merge the guest cart when logged in and guest cart contains items', () => {
      auth.isLoggedIn = true;
      guestCart.getCart.mockReturnValue(guestItems);
      cartApi.mergeCart.mockReturnValue(of(backendCart(backendItems)));

      store.loadCart();

      expect(cartApi.mergeCart).toHaveBeenCalledWith(guestItems);
      expect(guestCart.clearCart).toHaveBeenCalled();
      expect(store.isGuestCart()).toBe(false);
      expect(store.status()).toBe('loaded');
    });
  });

  describe('loadGuestCart', () => {
    it('should load items from the guest cart service', () => {
      guestCart.getCart.mockReturnValue(guestItems);

      store.loadGuestCart();

      expect(store.items()).toEqual(guestItems);
      expect(store.cartId()).toBeNull();
      expect(store.isGuestCart()).toBe(true);
      expect(store.status()).toBe('loaded');
    });

    it('should load an empty guest cart', () => {
      guestCart.getCart.mockReturnValue([]);

      store.loadGuestCart();

      expect(store.items()).toEqual([]);
      expect(store.isEmpty()).toBe(true);
      expect(store.status()).toBe('loaded');
    });
  });

  describe('loadBackendCart', () => {
    it('should load and map backend cart items', () => {
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));

      store.loadBackendCart();

      expect(store.items()).toEqual([
        {
          id: 501,
          product: {
            id: 1,
            name: 'Chocolate Donut',
            imageUrl: 'chocolate.jpg',
            price: 2.5,
          },
          quantity: 2,
        },
        {
          id: 502,
          product: {
            id: 2,
            name: 'Vanilla Donut',
            imageUrl: 'vanilla.jpg',
            price: 3,
          },
          quantity: 1,
        },
      ]);
      expect(store.cartId()).toBe(100);
      expect(store.isGuestCart()).toBe(false);
      expect(store.status()).toBe('loaded');
    });

    it('should set status to error when backend request fails', () => {
      cartApi.getCart.mockReturnValue(throwError(() => new Error('API error')));

      store.loadBackendCart();

      expect(store.status()).toBe('error');
    });
  });

  describe('addItem', () => {
    it('should add an item to the guest cart', () => {
      guestCart.addItem.mockReturnValue([
        { product: product1, quantity: 1 },
      ]);

      store.addItem(product1);

      expect(guestCart.addItem).toHaveBeenCalledWith(product1);
      expect(store.items()).toEqual([
        { product: product1, quantity: 1 },
      ]);
      expect(store.isGuestCart()).toBe(true);
      expect(store.status()).toBe('loaded');
    });

    it('should add an item to the backend cart when logged in', () => {
      auth.isLoggedIn = true;
      cartApi.addItem.mockReturnValue(of(backendCart(backendItems)));

      store.addItem(product1);

      expect(cartApi.addItem).toHaveBeenCalledWith(1, 1);
      expect(store.items()).toHaveLength(2);
      expect(store.isGuestCart()).toBe(false);
      expect(store.status()).toBe('loaded');
    });

    it('should set status to error when adding backend item fails', () => {
      auth.isLoggedIn = true;
      cartApi.addItem.mockReturnValue(throwError(() => new Error('API error')));

      store.addItem(product1);

      expect(store.status()).toBe('error');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity in the guest cart', () => {
      guestCart.updateQuantity.mockReturnValue([
        { product: product1, quantity: 5 },
      ]);

      store.updateQuantity(1, 5);

      expect(guestCart.updateQuantity).toHaveBeenCalledWith(1, 5);
      expect(store.items()).toEqual([
        { product: product1, quantity: 5 },
      ]);
      expect(store.status()).toBe('loaded');
    });

    it('should update quantity in the backend cart', () => {
      auth.isLoggedIn = true;

      store.loadGuestCart = vi.fn();
      // Seed the store through the backend response
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));
      store.loadBackendCart();

      cartApi.updateQuantity.mockReturnValue(of(backendCart(backendItems)));

      store.updateQuantity(1, 4);

      expect(cartApi.updateQuantity).toHaveBeenCalledWith(501, 4);
      expect(store.status()).toBe('loaded');
    });

    it('should remove item when quantity is less than one', () => {
      const removeSpy = vi.spyOn(store, 'removeItem');

      store.updateQuantity(1, 0);

      expect(removeSpy).toHaveBeenCalledWith(1);
    });

    it('should not update backend quantity when product is not found', () => {
      auth.isLoggedIn = true;

      store.updateQuantity(999, 5);

      expect(cartApi.updateQuantity).not.toHaveBeenCalled();
    });

    it('should set status to error when backend update fails', () => {
      auth.isLoggedIn = true;
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));
      store.loadBackendCart();

      cartApi.updateQuantity.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      store.updateQuantity(1, 3);

      expect(store.status()).toBe('error');
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the guest cart', () => {
      guestCart.removeItem.mockReturnValue([
        { product: product2, quantity: 1 },
      ]);

      store.removeItem(1);

      expect(guestCart.removeItem).toHaveBeenCalledWith(1);
      expect(store.items()).toEqual([
        { product: product2, quantity: 1 },
      ]);
      expect(store.isGuestCart()).toBe(true);
      expect(store.status()).toBe('loaded');
    });

    it('should remove an item from the backend cart', () => {
      auth.isLoggedIn = true;
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));
      store.loadBackendCart();

      cartApi.removeItem.mockReturnValue(of(backendCart([backendItems[1]])));

      store.removeItem(1);

      // Expected backend cart-item ID, not product ID
      expect(cartApi.removeItem).toHaveBeenCalledWith(501);
      expect(store.status()).toBe('loaded');
    });

    it('should not call backend when product is not found', () => {
      auth.isLoggedIn = true;

      store.removeItem(999);

      expect(cartApi.removeItem).not.toHaveBeenCalled();
    });

    it('should set status to error when backend removal fails', () => {
      auth.isLoggedIn = true;
      cartApi.getCart.mockReturnValue(of(backendCart(backendItems)));
      store.loadBackendCart();

      cartApi.removeItem.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      store.removeItem(1);

      expect(store.status()).toBe('error');
    });
  });

  describe('mergeGuestCart', () => {
    it('should merge guest cart items into backend cart', () => {
      guestCart.getCart.mockReturnValue(guestItems);
      cartApi.mergeCart.mockReturnValue(of(backendCart(backendItems)));

      store.mergeGuestCart();

      expect(cartApi.mergeCart).toHaveBeenCalledWith(guestItems);
      expect(store.items()).toHaveLength(2);
      expect(store.cartId()).toBe(100);
      expect(store.isGuestCart()).toBe(false);
      expect(store.status()).toBe('loaded');
      expect(guestCart.clearCart).toHaveBeenCalled();
    });

    it('should clear guest cart after successful merge', () => {
      guestCart.getCart.mockReturnValue(guestItems);
      cartApi.mergeCart.mockReturnValue(of(backendCart(backendItems)));

      store.mergeGuestCart();

      expect(guestCart.clearCart).toHaveBeenCalledTimes(1);
    });

    it('should not clear guest cart when merge fails', () => {
      guestCart.getCart.mockReturnValue(guestItems);
      cartApi.mergeCart.mockReturnValue(
        throwError(() => new Error('API error')),
      );

      store.mergeGuestCart();

      expect(guestCart.clearCart).not.toHaveBeenCalled();
      expect(store.status()).toBe('error');
    });

    it('should call loadCart when guest cart is empty', () => {
      guestCart.getCart.mockReturnValue([]);
      const loadCartSpy = vi.spyOn(store, 'loadCart');

      store.mergeGuestCart();

      expect(loadCartSpy).toHaveBeenCalled();
      expect(cartApi.mergeCart).not.toHaveBeenCalled();
    });
  });
});

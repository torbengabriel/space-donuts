import { TestBed } from '@angular/core/testing';

import { GuestCartService } from './guest-cart.service';
import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/cart-item.model';

describe('GuestCartService', () => {
  let service: GuestCartService;

  const storageKey = 'guest-cart';

  const product1 = { id: 1, name: 'Chocolate Donut' } as Product;
  const product2 = { id: 2, name: 'Vanilla Donut' } as Product;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});

    service = TestBed.inject(GuestCartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getCart', () => {
    it('should return an empty cart when nothing is stored', () => {
      expect(service.getCart()).toEqual([]);
    });

    it('should return the stored cart items', () => {
      const items: CartItem[] = [
        { product: product1, quantity: 2 },
        { product: product2, quantity: 1 },
      ];

      localStorage.setItem(storageKey, JSON.stringify(items));

      expect(service.getCart()).toEqual(items);
    });
  });

  describe('addItem', () => {
    it('should add a new product with quantity one', () => {
      const result = service.addItem(product1);

      expect(result).toEqual([
        {
          product: product1,
          quantity: 1,
        },
      ]);
    });

    it('should save the new product to localStorage', () => {
      service.addItem(product1);

      expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual([
        {
          product: product1,
          quantity: 1,
        },
      ]);
    });

    it('should increase the quantity when the product already exists', () => {
      service.addItem(product1);

      const result = service.addItem(product1);

      expect(result).toEqual([
        {
          product: product1,
          quantity: 2,
        },
      ]);
    });

    it('should not create a duplicate cart item when adding the same product', () => {
      service.addItem(product1);
      service.addItem(product1);
      service.addItem(product1);

      expect(service.getCart()).toHaveLength(1);
      expect(service.getCart()[0].quantity).toBe(3);
    });

    it('should add different products as separate cart items', () => {
      service.addItem(product1);
      service.addItem(product2);

      expect(service.getCart()).toEqual([
        { product: product1, quantity: 1 },
        { product: product2, quantity: 1 },
      ]);
    });

    it('should preserve existing quantities when adding another product', () => {
      service.addItem(product1);
      service.addItem(product1);
      service.addItem(product2);

      expect(service.getCart()).toEqual([
        { product: product1, quantity: 2 },
        { product: product2, quantity: 1 },
      ]);
    });
  });

  describe('updateQuantity', () => {
    it('should update the quantity of an existing product', () => {
      service.addItem(product1);

      const result = service.updateQuantity(1, 5);

      expect(result).toEqual([
        {
          product: product1,
          quantity: 5,
        },
      ]);
    });

    it('should save the updated quantity to localStorage', () => {
      service.addItem(product1);

      service.updateQuantity(1, 4);

      expect(service.getCart()[0].quantity).toBe(4);
    });

    it('should not change other cart items', () => {
      service.addItem(product1);
      service.addItem(product2);

      const result = service.updateQuantity(1, 3);

      expect(result).toEqual([
        { product: product1, quantity: 3 },
        { product: product2, quantity: 1 },
      ]);
    });

    it('should return the unchanged cart when the product does not exist', () => {
      service.addItem(product1);

      const result = service.updateQuantity(999, 5);

      expect(result).toEqual([{ product: product1, quantity: 1 }]);
    });
  });

  describe('removeItem', () => {
    it('should remove a product from the cart', () => {
      service.addItem(product1);
      service.addItem(product2);

      const result = service.removeItem(1);

      expect(result).toEqual([{ product: product2, quantity: 1 }]);
    });

    it('should save the updated cart to localStorage', () => {
      service.addItem(product1);
      service.addItem(product2);

      service.removeItem(1);

      expect(service.getCart()).toEqual([{ product: product2, quantity: 1 }]);
    });

    it('should return the unchanged cart when the product does not exist', () => {
      service.addItem(product1);

      const result = service.removeItem(999);

      expect(result).toEqual([{ product: product1, quantity: 1 }]);
    });

    it('should return an empty cart when removing the only product', () => {
      service.addItem(product1);

      const result = service.removeItem(1);

      expect(result).toEqual([]);
    });
  });

  describe('clearCart', () => {
    it('should remove the cart from localStorage', () => {
      service.addItem(product1);

      service.clearCart();

      expect(localStorage.getItem(storageKey)).toBeNull();
    });

    it('should return an empty cart after clearing', () => {
      service.addItem(product1);
      service.addItem(product2);

      service.clearCart();

      expect(service.getCart()).toEqual([]);
    });

    it('should not throw when clearing an already empty cart', () => {
      expect(() => service.clearCart()).not.toThrow();
      expect(service.getCart()).toEqual([]);
    });
  });
});

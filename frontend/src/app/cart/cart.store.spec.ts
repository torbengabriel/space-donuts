import { TestBed } from '@angular/core/testing';

import { Product } from '../products/product.model';
import { CartStore } from './cart.store';

const glazed: Product = { id: 1, name: 'Glazed', price: 2.5 } as Product;
const choco: Product = { id: 2, name: 'Choco', price: 3 } as Product;

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  beforeEach(() => {
    store = TestBed.inject(CartStore);
  });

  it('starts empty and closed', () => {
    expect(store.items()).toEqual([]);
    expect(store.isEmpty()).toBe(true);
    expect(store.isOpen()).toBe(false);
    expect(store.totalPrice()).toBe(0);
    expect(store.totalQuantity()).toBe(0);
  });

  describe('addDonut', () => {
    it('adds a new donut with quantity 1', () => {
      store.addDonut(glazed);

      expect(store.items()).toEqual([{ donut: glazed, quantity: 1 }]);
      expect(store.isEmpty()).toBe(false);
    });

    it('increases quantity when the donut is already in the cart', () => {
      store.addDonut(glazed);
      store.addDonut(glazed);

      expect(store.items().length).toBe(1);
      expect(store.items()[0].quantity).toBe(2);
    });

    it('keeps different products as separate items', () => {
      store.addDonut(glazed);
      store.addDonut(choco);

      expect(store.items().length).toBe(2);
    });
  });

  describe('increaseQuantity', () => {
    it('increases only the matching item', () => {
      store.addDonut(glazed);
      store.addDonut(choco);

      store.increaseQuantity(glazed.id);

      expect(store.items()[0].quantity).toBe(2);
      expect(store.items()[1].quantity).toBe(1);
    });

    it('ignores unknown ids', () => {
      store.addDonut(glazed);

      store.increaseQuantity(999);

      expect(store.items()[0].quantity).toBe(1);
    });
  });

  describe('decreaseQuantity', () => {
    it('decreases the quantity', () => {
      store.addDonut(glazed);
      store.increaseQuantity(glazed.id);

      store.decreaseQuantity(glazed.id);

      expect(store.items()[0].quantity).toBe(1);
    });

    it('removes the item when quantity reaches 0', () => {
      store.addDonut(glazed);

      store.decreaseQuantity(glazed.id);

      expect(store.items()).toEqual([]);
      expect(store.isEmpty()).toBe(true);
    });
  });

  describe('computed values', () => {
    it('calculates total quantity and total price', () => {
      store.addDonut(glazed); // 2.5
      store.increaseQuantity(glazed.id); // 2.5
      store.addDonut(choco); // 3

      expect(store.totalQuantity()).toBe(3);
      expect(store.totalPrice()).toBe(8);
    });
  });

  describe('cart visibility', () => {
    it('opens and closes the cart', () => {
      store.openCart();
      expect(store.isOpen()).toBe(true);

      store.closeCart();
      expect(store.isOpen()).toBe(false);
    });
  });
});

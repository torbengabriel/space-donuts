import { TestBed } from '@angular/core/testing';

import { Donut } from '../donuts/models/donut.model';
import { CartStore } from './cart.store';

const glazed: Donut = { id: 1, title: 'Glazed', price: 2.5 } as Donut;
const choco: Donut = { id: 2, title: 'Choco', price: 3 } as Donut;

describe('CartStore', () => {
  let store: InstanceType<typeof CartStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CartStore);
  });

  it('starts empty and closed', () => {
    expect(store.items()).toEqual([]);
    expect(store.isEmpty()).toBe(true);
    expect(store.isCartOpen()).toBe(false);
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

    it('keeps different donuts as separate items', () => {
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
      expect(store.isCartOpen()).toBe(true);

      store.closeCart();
      expect(store.isCartOpen()).toBe(false);
    });
  });
});

import { Component, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CartLine } from './cart-line';
import { QuantitySelector } from '../../../../../shared/quantity-selector/quantity-selector';
import { CartItem } from '../../../models/cart-item.model';

describe('CartLine', () => {
  const cartItem = {
    id: 101,
    product: {
      id: 1,
      name: 'Chocolate Donut',
      price: 2.5,
      imageUrl: '/images/chocolate-donut.png',
    },
    quantity: 3,
  } as CartItem;

  @Component({
    selector: 'app-quantity-selector',
    standalone: true,
    template: '',
  })
  class MockQuantitySelector {
    quantity = input<number>(0);
    quantityChange = output<number>();
    remove = output<void>();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CartLine],
    });

    TestBed.overrideComponent(CartLine, {
      remove: {
        imports: [QuantitySelector],
      },
      add: {
        imports: [MockQuantitySelector],
      },
    });

    await TestBed.compileComponents();
  });

  function createComponent(item: CartItem = cartItem) {
    const fixture = TestBed.createComponent(CartLine);

    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();

    return fixture;
  }

  describe('rendering', () => {
    it('should render the cart item', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-item')).not.toBeNull();
    });

    it('should display the product name', () => {
      const fixture = createComponent();

      const title: HTMLElement = fixture.nativeElement.querySelector('.cart-item-title');

      expect(title.textContent).toContain('Chocolate Donut');
    });

    it('should display the product image', () => {
      const fixture = createComponent();

      const image: HTMLImageElement = fixture.nativeElement.querySelector('.cart-item-image');

      expect(image.getAttribute('src')).toBe('/images/chocolate-donut.png');
    });

    it('should use the product name as image alt text', () => {
      const fixture = createComponent();

      const image: HTMLImageElement = fixture.nativeElement.querySelector('.cart-item-image');

      expect(image.getAttribute('alt')).toBe('Chocolate Donut');
    });
  });

  describe('quantity selector', () => {
    it('should render the quantity selector', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-quantity-selector')).not.toBeNull();
    });

    it('should pass the current quantity to the quantity selector', () => {
      const fixture = createComponent();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      expect(quantitySelector).not.toBeNull();
      expect(quantitySelector.componentInstance.quantity()).toBe(3);
    });

    it('should emit quantityChange when the quantity selector emits', () => {
      const fixture = createComponent();
      const component = fixture.componentInstance;

      const quantityChangeSpy = vi.fn();
      component.quantityChange.subscribe(quantityChangeSpy);

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      quantitySelector.componentInstance.quantityChange.emit(5);

      expect(quantityChangeSpy).toHaveBeenCalledWith(5);
    });

    it('should emit remove when the quantity selector emits remove', () => {
      const fixture = createComponent();
      const component = fixture.componentInstance;

      const removeSpy = vi.fn();
      component.remove.subscribe(removeSpy);

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      quantitySelector.componentInstance.remove.emit();

      expect(removeSpy).toHaveBeenCalledOnce();
    });
  });

  describe('item total price', () => {
    it('should display the total price for the cart item', () => {
      const fixture = createComponent();

      const price: HTMLElement = fixture.nativeElement.querySelector('.cart-item-price');

      // 2.50 * 3 = 7.50
      expect(price.textContent).toContain('7.50');
    });

    it('should calculate the price based on the current quantity', () => {
      const item = {
        ...cartItem,
        quantity: 4,
      } as CartItem;

      const fixture = createComponent(item);

      const price: HTMLElement = fixture.nativeElement.querySelector('.cart-item-price');

      // 2.50 * 4 = 10.00
      expect(price.textContent).toContain('10.00');
    });

    it('should calculate the price correctly for a different product price', () => {
      const item = {
        ...cartItem,
        product: {
          ...cartItem.product,
          price: 4.99,
        },
        quantity: 2,
      } as CartItem;

      const fixture = createComponent(item);

      const price: HTMLElement = fixture.nativeElement.querySelector('.cart-item-price');

      // 4.99 * 2 = 9.98
      expect(price.textContent).toContain('9.98');
    });
  });
});

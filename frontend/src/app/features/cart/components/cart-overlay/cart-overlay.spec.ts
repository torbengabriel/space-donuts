import { Component, computed, input, output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { of, throwError } from 'rxjs';

import { CartOverlay } from './cart-overlay';
import { CartStore } from '../../store/cart.store';
import { CartLine } from './cart-line/cart-line';
import { CartItem } from '../../models/cart-item.model';
import { OrderApiService } from '../../../order/services/order-api.service';
import { OverlayStore } from '../../../../core/overlay/overlay.store';

describe('CartOverlay', () => {
  let cartStore: {
    items: ReturnType<typeof signal<CartItem[]>>;
    isEmpty: ReturnType<typeof computed<boolean>>;
    totalPrice: ReturnType<typeof computed<number>>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    loadCart: ReturnType<typeof vi.fn>;
  };

  let orderService: {
    checkout: ReturnType<typeof vi.fn>;
  };

  let overlayStore: {
    close: ReturnType<typeof vi.fn>;
  };

  const product1 = {
    id: 1,
    name: 'Chocolate Donut',
    price: 2.5,
  };

  const product2 = {
    id: 2,
    name: 'Vanilla Donut',
    price: 3.5,
  };

  const cartItem1 = {
    id: 101,
    product: product1,
    quantity: 2,
  } as CartItem;

  const cartItem2 = {
    id: 102,
    product: product2,
    quantity: 1,
  } as CartItem;

  @Component({
    selector: 'app-cart-line',
    standalone: true,
    template: '',
  })
  class MockCartLine {
    item = input<CartItem>();
    quantityChange = output<number>();
    remove = output<void>();
  }

  beforeEach(async () => {
    const items = signal<CartItem[]>([]);

    cartStore = {
      items,
      isEmpty: computed(() => items().length === 0),
      totalPrice: computed(() =>
        items().reduce((total, item) => total + item.product.price * item.quantity, 0),
      ),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      loadCart: vi.fn(),
    };

    orderService = {
      checkout: vi.fn().mockReturnValue(of({ id: 1 })),
    };

    overlayStore = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [CartOverlay],
      providers: [
        { provide: CartStore, useValue: cartStore },
        { provide: OrderApiService, useValue: orderService },
        { provide: OverlayStore, useValue: overlayStore },
      ],
    });

    TestBed.overrideComponent(CartOverlay, {
      remove: {
        imports: [CartLine],
      },
      add: {
        imports: [MockCartLine],
      },
    });

    await TestBed.compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(CartOverlay);
    fixture.detectChanges();
    return fixture;
  }

  describe('rendering', () => {
    it('should render the shopping cart heading', () => {
      const fixture = createComponent();

      const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h2');

      expect(heading.textContent).toContain('Shopping Cart');
    });

    it('should display the empty cart message when cart is empty', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.textContent).toContain('Your shopping cart is empty.');
    });

    it('should not render cart items when cart is empty', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-items')).toBeNull();
    });

    it('should not render the cart footer when cart is empty', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-footer')).toBeNull();
    });

    it('should render cart items when cart is not empty', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-items')).not.toBeNull();

      expect(fixture.nativeElement.querySelector('.cart-footer')).not.toBeNull();
    });

    it('should not display the empty cart message when cart has items', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      expect(fixture.nativeElement.textContent).not.toContain('Your shopping cart is empty.');
    });
  });

  describe('cart items', () => {
    it('should render one cart line for each item', () => {
      cartStore.items.set([cartItem1, cartItem2]);

      const fixture = createComponent();

      const cartLines = fixture.nativeElement.querySelectorAll('app-cart-line');

      expect(cartLines.length).toBe(2);
    });

    it('should pass the correct item to each cart line', () => {
      cartStore.items.set([cartItem1, cartItem2]);

      const fixture = createComponent();

      const cartLines = fixture.debugElement.queryAll(
        (element) => element.componentInstance instanceof MockCartLine,
      );

      expect(cartLines[0].componentInstance.item()).toEqual(cartItem1);
      expect(cartLines[1].componentInstance.item()).toEqual(cartItem2);
    });

    it('should render cart lines inside a list', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      const list = fixture.nativeElement.querySelector('.cart-items');

      expect(list.tagName).toBe('UL');
      expect(list.getAttribute('role')).toBe('list');
      expect(list.querySelectorAll('li').length).toBe(1);
    });

    it('should call updateQuantity when quantityChange is emitted', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      const cartLine = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockCartLine,
      );

      cartLine.componentInstance.quantityChange.emit(5);

      expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('should call removeItem when remove is emitted', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      const cartLine = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockCartLine,
      );

      cartLine.componentInstance.remove.emit();

      expect(cartStore.removeItem).toHaveBeenCalledWith(1);
    });
  });

  describe('cart total', () => {
    it('should display the total price', () => {
      cartStore.items.set([cartItem1, cartItem2]);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-total-price').textContent).toContain(
        '8.50',
      );
    });

    it('should display the total label', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.cart-total-label').textContent).toContain(
        'Total',
      );
    });
  });

  describe('checkout', () => {
    it('should render the order button', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.cart-footer button');

      expect(button).not.toBeNull();
      expect(button.textContent).toContain('Order now');
    });

    it('should call checkout when order button is clicked', () => {
      cartStore.items.set([cartItem1]);

      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.cart-footer button');

      button.click();

      expect(orderService.checkout).toHaveBeenCalledOnce();
    });

    it('should load the cart and close the overlay after successful checkout', () => {
      const order = { id: 123 };

      orderService.checkout.mockReturnValue(of(order));

      const fixture = createComponent();
      fixture.componentInstance.checkout();

      expect(cartStore.loadCart).toHaveBeenCalledOnce();
      expect(overlayStore.close).toHaveBeenCalledOnce();
    });

    it('should not close the overlay when checkout fails', () => {
      const error = new Error('Checkout failed');

      orderService.checkout.mockReturnValue(throwError(() => error));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const fixture = createComponent();
      fixture.componentInstance.checkout();

      expect(overlayStore.close).not.toHaveBeenCalled();
      expect(cartStore.loadCart).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Checkout failed', error);

      consoleErrorSpy.mockRestore();
    });
  });
});

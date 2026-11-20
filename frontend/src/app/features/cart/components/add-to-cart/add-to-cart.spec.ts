import { Component, input, output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AddToCart } from './add-to-cart';
import { CartStore } from '../../store/cart.store';
import { Product } from '../../../products/models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { QuantitySelector } from '../../../../shared/quantity-selector/quantity-selector';

describe('AddToCart', () => {
  let cartStore: {
    items: ReturnType<typeof signal<CartItem[]>>;
    addItem: ReturnType<typeof vi.fn>;
    updateQuantity: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
  };

  const product = {
    id: 1,
    name: 'Chocolate Donut',
    price: 2.5,
  } as Product;

  const anotherProduct = {
    id: 2,
    name: 'Vanilla Donut',
    price: 3,
  } as Product;

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
    cartStore = {
      items: signal<CartItem[]>([]),
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [AddToCart],
      providers: [
        {
          provide: CartStore,
          useValue: cartStore,
        },
      ],
    });

    TestBed.overrideComponent(AddToCart, {
      remove: {
        imports: [QuantitySelector],
      },
      add: {
        imports: [MockQuantitySelector],
      },
    });

    await TestBed.compileComponents();
  });

  function createComponent(productInput: Product = product) {
    const fixture = TestBed.createComponent(AddToCart);

    fixture.componentRef.setInput('product', productInput);
    fixture.detectChanges();

    return fixture;
  }

  describe('when quantity is zero', () => {
    it('should render the add-to-cart button', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.add-to-cart-button')).not.toBeNull();

      expect(fixture.nativeElement.querySelector('app-quantity-selector')).toBeNull();
    });

    it('should display the correct aria-label', () => {
      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.add-to-cart-button');

      expect(button.getAttribute('aria-label')).toBe('Add Chocolate Donut to cart');
    });

    it('should call addItem with the current product when clicked', () => {
      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.add-to-cart-button');

      button.click();

      expect(cartStore.addItem).toHaveBeenCalledWith(product);
    });
  });

  describe('when quantity is greater than zero', () => {
    beforeEach(() => {
      cartStore.items.set([
        {
          product,
          quantity: 2,
        } as CartItem,
      ]);
    });

    it('should render the quantity selector instead of the add button', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-quantity-selector')).not.toBeNull();

      expect(fixture.nativeElement.querySelector('.add-to-cart-button')).toBeNull();
    });

    it('should pass the current quantity to the quantity selector', () => {
      const fixture = createComponent();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      expect(quantitySelector).not.toBeNull();
      expect(quantitySelector.componentInstance.quantity()).toBe(2);
    });

    it('should call updateQuantity when quantityChange is emitted', () => {
      const fixture = createComponent();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      quantitySelector.componentInstance.quantityChange.emit(5);

      expect(cartStore.updateQuantity).toHaveBeenCalledWith(product.id, 5);
    });

    it('should call removeItem when remove is emitted', () => {
      const fixture = createComponent();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      quantitySelector.componentInstance.remove.emit();

      expect(cartStore.removeItem).toHaveBeenCalledWith(product.id);
    });
  });

  describe('cart quantity display', () => {
    it('should render the add button when the product is not in the cart', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.add-to-cart-button')).not.toBeNull();
    });

    it('should render the quantity selector when the product is in the cart', () => {
      cartStore.items.set([
        {
          product,
          quantity: 3,
        } as CartItem,
      ]);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-quantity-selector')).not.toBeNull();
    });

    it('should use the quantity of the matching product', () => {
      cartStore.items.set([
        {
          product: anotherProduct,
          quantity: 7,
        } as CartItem,
        {
          product,
          quantity: 2,
        } as CartItem,
      ]);

      const fixture = createComponent();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      expect(quantitySelector.componentInstance.quantity()).toBe(2);
    });

    it('should not display the quantity of another product', () => {
      cartStore.items.set([
        {
          product: anotherProduct,
          quantity: 7,
        } as CartItem,
      ]);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.add-to-cart-button')).not.toBeNull();

      expect(fixture.nativeElement.querySelector('app-quantity-selector')).toBeNull();
    });

    it('should update the displayed quantity when cart items change', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('.add-to-cart-button')).not.toBeNull();

      cartStore.items.set([
        {
          product,
          quantity: 4,
        } as CartItem,
      ]);

      fixture.detectChanges();

      const quantitySelector = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockQuantitySelector,
      );

      expect(quantitySelector).not.toBeNull();
      expect(quantitySelector.componentInstance.quantity()).toBe(4);
    });
  });
});

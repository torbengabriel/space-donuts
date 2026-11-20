import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CartButton } from './cart-button';
import { CartStore } from '../../store/cart.store';
import { CountBadge } from '../../../../shared/count-badge/count-badge';

describe('CartButton', () => {
  let cartStore: {
    totalQuantity: ReturnType<typeof signal<number>>;
  };

  @Component({
    selector: 'app-count-badge',
    standalone: true,
    template: '',
  })
  class MockCountBadge {
    count = input<number>(0);
  }

  beforeEach(async () => {
    cartStore = {
      totalQuantity: signal(0),
    };

    TestBed.configureTestingModule({
      imports: [CartButton],
      providers: [
        {
          provide: CartStore,
          useValue: cartStore,
        },
      ],
    });

    TestBed.overrideComponent(CartButton, {
      remove: {
        imports: [CountBadge],
      },
      add: {
        imports: [MockCountBadge],
      },
    });

    await TestBed.compileComponents();
  });

  function createComponent() {
    const fixture = TestBed.createComponent(CartButton);
    fixture.detectChanges();
    return fixture;
  }

  describe('rendering', () => {
    it('should render the cart button', () => {
      const fixture = createComponent();

      const button = fixture.nativeElement.querySelector('.icon-button');

      expect(button).not.toBeNull();
    });

    it('should have the correct aria-label', () => {
      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.icon-button');

      expect(button.getAttribute('aria-label')).toBe('Shopping Cart');
    });

    it('should render a button with type button', () => {
      const fixture = createComponent();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.icon-button');

      expect(button.type).toBe('button');
    });
  });

  describe('click event', () => {
    it('should emit clicked when the button is clicked', () => {
      const fixture = createComponent();
      const component = fixture.componentInstance;
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('.icon-button');

      const clickedSpy = vi.fn();
      component.clicked.subscribe(clickedSpy);

      button.click();

      expect(clickedSpy).toHaveBeenCalledOnce();
    });
  });

  describe('count badge', () => {
    it('should not render the count badge when cart is empty', () => {
      cartStore.totalQuantity.set(0);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-count-badge')).toBeNull();
    });

    it('should render the count badge when cart has items', () => {
      cartStore.totalQuantity.set(3);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-count-badge')).not.toBeNull();
    });

    it('should pass the correct count to the badge', () => {
      cartStore.totalQuantity.set(5);

      const fixture = createComponent();

      const badge = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockCountBadge,
      );

      expect(badge).not.toBeNull();
      expect(badge.componentInstance.count()).toBe(5);
    });

    it('should update the badge when cart quantity changes', () => {
      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-count-badge')).toBeNull();

      cartStore.totalQuantity.set(2);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-count-badge')).not.toBeNull();

      const badge = fixture.debugElement.query(
        (element) => element.componentInstance instanceof MockCountBadge,
      );

      expect(badge.componentInstance.count()).toBe(2);
    });

    it('should remove the badge when cart quantity returns to zero', () => {
      cartStore.totalQuantity.set(2);

      const fixture = createComponent();

      expect(fixture.nativeElement.querySelector('app-count-badge')).not.toBeNull();

      cartStore.totalQuantity.set(0);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-count-badge')).toBeNull();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItem } from '../../cart-item.model';
import { CartLine } from './cart-line';

const item: CartItem = {
  donut: { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
  quantity: 3,
};

describe('CartLine', () => {
  let fixture: ComponentFixture<CartLine>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CartLine] }).compileComponents();

    fixture = TestBed.createComponent(CartLine);
    fixture.componentRef.setInput('item', item);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('renders image, alt text and title of the donut', () => {
    const img = element.querySelector<HTMLImageElement>('.cart-line-image')!;

    expect(img.getAttribute('src')).toBe('glazed.png');
    expect(img.alt).toBe('Glazed');
    expect(element.querySelector('.cart-line-title')!.textContent).toContain('Glazed');
  });

  it('shows the line total (price x quantity)', () => {
    expect(element.querySelector('.cart-line-price')!.textContent).toContain('7.50');
  });

  it('updates the line total when the quantity changes', async () => {
    fixture.componentRef.setInput('item', { ...item, quantity: 4 });
    await fixture.whenStable();

    expect(element.querySelector('.cart-line-price')!.textContent).toContain('10.00');
  });

  it('passes the quantity to the quantity selector', () => {
    expect(element.querySelector('app-quantity-selector span')!.textContent).toBe('3');
  });

  it('emits quantityIncreased when plus is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.quantityIncreased.subscribe(spy);

    element.querySelector<HTMLButtonElement>('[aria-label="Increase quantity"]')!.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits quantityDecreased when minus is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.quantityDecreased.subscribe(spy);

    element.querySelector<HTMLButtonElement>('[aria-label="Decrease quantity"]')!.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

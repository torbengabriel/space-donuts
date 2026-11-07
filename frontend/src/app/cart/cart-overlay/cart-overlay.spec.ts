import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donut } from '../../donuts/donut.model';
import { CartStore } from '../cart.store';
import { CartOverlay } from './cart-overlay';

const glazed: Donut = {
  id: 1,
  title: 'Glazed',
  description: 'Sweet',
  price: 2.5,
  image: 'glazed.png',
};
const choco: Donut = { id: 2, title: 'Choco', description: 'Rich', price: 3, image: 'choco.png' };

describe('CartOverlay', () => {
  let fixture: ComponentFixture<CartOverlay>;
  let store: InstanceType<typeof CartStore>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CartOverlay] }).compileComponents();

    store = TestBed.inject(CartStore);
    store.openCart();

    fixture = TestBed.createComponent(CartOverlay);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('shows the empty message when the cart is empty', () => {
    expect(element.textContent).toContain('Your shopping cart is empty.');
    expect(element.querySelectorAll('app-cart-line').length).toBe(0);
  });

  it('renders one line per cart item', async () => {
    store.addDonut(glazed);
    store.addDonut(choco);
    await fixture.whenStable();

    expect(element.querySelectorAll('app-cart-line').length).toBe(2);
    expect(element.textContent).not.toContain('Your shopping cart is empty.');
  });

  it('shows the total price', async () => {
    store.addDonut(glazed);
    store.addDonut(choco);
    await fixture.whenStable();

    expect(element.querySelector('.cart-total-price')!.textContent).toContain('5.50');
  });

  it('removes the line when the quantity drops to 0', async () => {
    store.addDonut(glazed);
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('[aria-label="Decrease quantity"]')!.click();
    await fixture.whenStable();

    expect(element.querySelectorAll('app-cart-line').length).toBe(0);
    expect(element.textContent).toContain('Your shopping cart is empty.');
  });

  it('renders nothing when closed', async () => {
    store.openCart();
    await fixture.whenStable();

    expect(element.querySelector('h2')).toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutItem } from './donut-item';
import { CartStore } from '../../cart/cart.store';
import { Donut } from '../models/donut.model';

describe('DonutItem', () => {
  let fixture: ComponentFixture<DonutItem>;
  let store: InstanceType<typeof CartStore>;
  let element: HTMLElement;

  const donut: Donut = {
    id: 1,
    title: 'Glazed',
    description: 'Sweet',
    price: 2.5,
    image: 'glazed.png',
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutItem],
    }).compileComponents();

    store = TestBed.inject(CartStore);
    fixture = TestBed.createComponent(DonutItem);
    fixture.componentRef.setInput('donut', donut);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('shows the add button when the donut is not in the cart', () => {
    expect(element.querySelector('[aria-label="Add Glazed to cart"]')).not.toBeNull();
    expect(element.querySelector('app-quantity-selector')).toBeNull();
  });

  it('replaces the add button with the quantity selector after adding', async () => {
    element.querySelector<HTMLButtonElement>('[aria-label="Add Glazed to cart"]')!.click();
    await fixture.whenStable();

    expect(store.items()).toEqual([{ donut, quantity: 1 }]);
    expect(element.querySelector('app-quantity-selector')).not.toBeNull();
  });

  it('brings the add button back when the quantity drops to 0', async () => {
    store.addDonut(donut);
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('[aria-label="Decrease quantity"]')!.click();
    await fixture.whenStable();

    expect(element.querySelector('[aria-label="Add Glazed to cart"]')).not.toBeNull();
  });

  it('increases the quantity with each click on plus', async () => {
    store.addDonut(donut);
    await fixture.whenStable();

    const plus = element.querySelector<HTMLButtonElement>('[aria-label="Increase quantity"]')!;
    plus.click();
    plus.click();
    await fixture.whenStable();

    expect(store.items()[0].quantity).toBe(3); // 1 using addDonut + 2 clicks
    expect(element.querySelector('app-quantity-selector span')!.textContent).toBe('3');
  });

  it('shows the correct quantity after increasing twice and decreasing once', async () => {
    element.querySelector<HTMLButtonElement>('[aria-label="Add Glazed to cart"]')!.click();
    await fixture.whenStable();

    const plus = () =>
      element.querySelector<HTMLButtonElement>('[aria-label="Increase quantity"]')!;
    const minus = () =>
      element.querySelector<HTMLButtonElement>('[aria-label="Decrease quantity"]')!;

    plus().click();
    await fixture.whenStable();
    plus().click();
    await fixture.whenStable();
    minus().click();
    await fixture.whenStable();

    expect(store.items()[0].quantity).toBe(2); // 1 + 1 + 1 - 1
    expect(element.querySelector('app-quantity-selector span')!.textContent).toBe('2');
  });
});

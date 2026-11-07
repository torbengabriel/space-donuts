import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { App } from './app';
import { CartStore } from './cart/cart.store';
import { DonutService } from './donuts/services/donut';

class MockIntersectionObserver {
  static instance: MockIntersectionObserver;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(private callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instance = this;
  }

  trigger(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as never);
  }
}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: DonutService, useValue: { getDonuts: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  afterEach(() => vi.unstubAllGlobals());

  it('hides the sticky cart while the header is visible', () => {
    expect(element.querySelector('.sticky-cart')).toBeNull();
  });

  it('shows the sticky cart when the header leaves the viewport', async () => {
    MockIntersectionObserver.instance.trigger(false);
    await fixture.whenStable();

    expect(element.querySelector('.sticky-cart')).not.toBeNull();
  });

  it('opens the cart when the sticky cart button is clicked', async () => {
    MockIntersectionObserver.instance.trigger(false);
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('.sticky-cart button')!.click();

    expect(TestBed.inject(CartStore).isCartOpen()).toBe(true);
  });
});

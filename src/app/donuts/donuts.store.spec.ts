import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of, throwError } from 'rxjs';

import { Donut } from './donut.model';
import { DonutsStore } from './donuts.store';
import { DonutService } from './services/donut';

const donuts: Donut[] = [
  { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
  { id: 2, title: 'Choco', description: 'Rich', price: 3, image: 'choco.png' },
];

describe('DonutsStore', () => {
  // Injecting the store triggers onInit and therefore the loading,
  // so the DonutService stub must be in place before the first inject.
  function setup(getDonuts: () => Observable<Donut[]>) {
    TestBed.configureTestingModule({
      providers: [{ provide: DonutService, useValue: { getDonuts } }],
    });

    return TestBed.inject(DonutsStore);
  }

  it('is loading while the request is pending', () => {
    const store = setup(() => NEVER);

    expect(store.status()).toBe('loading');
    expect(store.isLoading()).toBe(true);
    expect(store.donuts()).toEqual([]);
  });

  it('provides the donuts once they are loaded', () => {
    const store = setup(() => of(donuts));

    expect(store.donuts()).toEqual(donuts);
    expect(store.status()).toBe('loaded');
    expect(store.isLoading()).toBe(false);
    expect(store.hasError()).toBe(false);
  });

  it('sets the error state when loading fails', () => {
    const store = setup(() => throwError(() => new Error('Network error')));

    expect(store.hasError()).toBe(true);
    expect(store.status()).toBe('error');
    expect(store.isLoading()).toBe(false);
    expect(store.donuts()).toEqual([]);
  });

  it('requests the donuts only once', () => {
    const getDonuts = vi.fn(() => of(donuts));
    setup(getDonuts);

    TestBed.inject(DonutsStore);
    TestBed.inject(DonutsStore);

    expect(getDonuts).toHaveBeenCalledTimes(1);
  });
});

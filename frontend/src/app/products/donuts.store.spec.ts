import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of, throwError } from 'rxjs';

import { Product } from './product.model';
import { ProductsStore } from './product.store';
import { ProductService } from './services/product.service';

const donuts: Product[] = [
  { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
  { id: 2, title: 'Choco', description: 'Rich', price: 3, image: 'choco.png' },
];

describe('ProductsStore', () => {
  // Injecting the store triggers onInit and therefore the loading,
  // so the DonutService stub must be in place before the first inject.
  function setup(getDonuts: () => Observable<Product[]>) {
    TestBed.configureTestingModule({
      providers: [{ provide: ProductService, useValue: { getDonuts } }],
    });

    return TestBed.inject(ProductsStore);
  }

  it('is loading while the request is pending', () => {
    const store = setup(() => NEVER);

    expect(store.status()).toBe('loading');
    expect(store.isLoading()).toBe(true);
    expect(store.donuts()).toEqual([]);
  });

  it('provides the products once they are loaded', () => {
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

  it('requests the products only once', () => {
    const getDonuts = vi.fn(() => of(donuts));
    setup(getDonuts);

    TestBed.inject(ProductsStore);
    TestBed.inject(ProductsStore);

    expect(getDonuts).toHaveBeenCalledTimes(1);
  });
});

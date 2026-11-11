import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Product } from '../product.model';
import { ProductService } from './product.service';

describe('DonutService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('loads the products from the json file', () => {
    const donuts: Product[] = [
      { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
    ];
    let result: Product[] | undefined;

    service.getDonuts().subscribe((response) => (result = response));

    const request = httpTesting.expectOne('/data/donuts.json');
    expect(request.request.method).toBe('GET');

    request.flush(donuts);

    expect(result).toEqual(donuts);
  });
});

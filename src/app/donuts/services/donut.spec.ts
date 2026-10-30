import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Donut } from '../models/donut.model';
import { DonutService } from './donut';

describe('DonutService', () => {
  let service: DonutService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DonutService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('loads the donuts from the json file', () => {
    const donuts: Donut[] = [
      { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
    ];
    let result: Donut[] | undefined;

    service.getDonuts().subscribe((response) => (result = response));

    const request = httpTesting.expectOne('/data/donuts.json');
    expect(request.request.method).toBe('GET');

    request.flush(donuts);

    expect(result).toEqual(donuts);
  });
});

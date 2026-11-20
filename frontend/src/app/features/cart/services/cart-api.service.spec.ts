import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CartApiService } from './cart-api.service';
import { environment } from '../../../../environments/environment';
import { CartItem } from '../models/cart-item.model';

describe('CartApiService', () => {
  let service: CartApiService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/cart`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCart', () => {
    it('should send a GET request to the cart endpoint', () => {
      service.getCart().subscribe();

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('GET');

      req.flush({});
    });
  });

  describe('addItem', () => {
    it('should send a POST request with productId and quantity', () => {
      service.addItem(42, 3).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/items`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        productId: 42,
        quantity: 3,
      });

      req.flush({});
    });
  });

  describe('updateQuantity', () => {
    it('should send a PATCH request with the updated quantity', () => {
      service.updateQuantity(7, 5).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/items/7`);

      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        quantity: 5,
      });

      req.flush({});
    });
  });

  describe('removeItem', () => {
    it('should send a DELETE request for the cart item', () => {
      service.removeItem(7).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/items/7`);

      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });
  });

  describe('mergeCart', () => {
    it('should send a POST request with mapped cart items', () => {
      const items = [
        {
          product: { id: 10 },
          quantity: 2,
        },
        {
          product: { id: 20 },
          quantity: 4,
        },
      ] as CartItem[];

      service.mergeCart(items).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/merge`);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        items: [
          {
            productId: 10,
            quantity: 2,
          },
          {
            productId: 20,
            quantity: 4,
          },
        ],
      });

      req.flush({});
    });
  });
});

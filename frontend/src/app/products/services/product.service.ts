import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../product.model';
import { ProductCategory } from '../product-category.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api';

  getProducts(category: ProductCategory): Observable<Product[]> {
    //return this.http.get<Product[]>('/data/products.json');
    return this.http.get<Product[]>(`${this.apiUrl}/donuts`, {
      params: { category },
    });
  }
}

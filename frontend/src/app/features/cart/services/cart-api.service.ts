import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartResponse } from '../models/cart.model';
import { environment } from '../../../../environments/environment';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  public getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl);
  }

  public addItem(productId: number, quantity: number): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/items`, { productId, quantity });
  }

  public updateQuantity(cartItemId: number, quantity: number): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${this.apiUrl}/items/${cartItemId}`, { quantity });
  }

  public removeItem(itemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/items/${itemId}`);
  }

  public mergeCart(items: CartItem[]) {
    return this.http.post<CartResponse>(`${this.apiUrl}/merge`, {
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    });
  }
}

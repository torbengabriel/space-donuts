import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/orders';

  checkout(): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${this.apiUrl}/checkout`,
      {}
    );
  }
}

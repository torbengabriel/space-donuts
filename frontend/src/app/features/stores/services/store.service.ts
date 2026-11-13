import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from './store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api';

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>('/data/stores.json');
    // return this.http.get<Product[]>(`${this.apiUrl}/donuts`, {
    //   params: { category },
    // });
  }
}

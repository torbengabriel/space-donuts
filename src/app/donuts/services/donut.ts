import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Donut } from '../models/donut.model';

@Injectable({
  providedIn: 'root',
})
export class DonutService {
  private readonly http = inject(HttpClient);

  getDonuts(): Observable<Donut[]> {
    return this.http.get<Donut[]>('/data/donuts.json');
  }
}

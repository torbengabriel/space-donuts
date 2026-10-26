import { Component, input } from '@angular/core';

import { Donut } from '../models/donut.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-donut-item',
  templateUrl: './donut-item.html',
  styleUrl: './donut-item.scss',
  imports: [CurrencyPipe],
})
export class DonutItem {
  readonly donut = input.required<Donut>();
}

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { DonutService } from '../services/donut';
import { DonutItem } from '../donut-item/donut-item';

@Component({
  selector: 'app-donut-list',
  imports: [AsyncPipe, DonutItem],
  templateUrl: './donut-list.html',
  styleUrl: './donut-list.scss',
})
export class DonutList {
  private readonly donutService = inject(DonutService);

  readonly donuts$ = this.donutService.getDonuts();
}

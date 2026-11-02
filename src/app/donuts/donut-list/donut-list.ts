import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DonutItem } from '../donut-item/donut-item';
import { DonutsStore } from '../donuts.store';

@Component({
  selector: 'app-donut-list',
  imports: [DonutItem],
  templateUrl: './donut-list.html',
  styleUrl: './donut-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutList {
  protected readonly donutsStore = inject(DonutsStore);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DonutService } from '../services/donut';
import { DonutItem } from '../donut-item/donut-item';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-donut-list',
  imports: [DonutItem],
  templateUrl: './donut-list.html',
  styleUrl: './donut-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutList {
  private readonly donutService = inject(DonutService);

  protected readonly donuts = toSignal(this.donutService.getDonuts(), { initialValue: [] });
}

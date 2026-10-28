import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DonutService } from '../services/donut';
import { DonutItemComponent } from '../donut-item/donut-item.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-donut-list',
  imports: [DonutItemComponent],
  templateUrl: './donut-list.component.html',
  styleUrl: './donut-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutListComponent {
  private readonly donutService = inject(DonutService);

  protected readonly donuts = toSignal(this.donutService.getDonuts(), { initialValue: [] });
}

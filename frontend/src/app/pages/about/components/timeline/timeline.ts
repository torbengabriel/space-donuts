import { Component, input, output } from '@angular/core';
import { TimelineItem } from '../../timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class TimelineComponent {
  items = input.required<TimelineItem[]>();

  protected itemSelected = output<TimelineItem>();

  public selectItem(item: TimelineItem): void {
    this.itemSelected.emit(item);
  }
}

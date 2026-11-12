import { Component } from '@angular/core';
import { SPACE_DONUTS_HISTORY } from './data/space-donuts-timeline';
import { TimelineComponent } from './components/timeline/timeline';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TimelineComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly history = SPACE_DONUTS_HISTORY;
}

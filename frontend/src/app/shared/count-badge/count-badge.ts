import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-count-badge',
  styleUrl: './count-badge.scss',
  templateUrl: './count-badge.html',
})
export class CountBadge {
  public readonly count = input.required<number>();
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideHeart } from '@lucide/angular';

@Component({
  selector: 'app-favorite-toggle',
  imports: [LucideHeart],
  templateUrl: './favorite-toggle.component.html',
  styleUrl: './favorite-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteToggle {
  readonly active = input.required<boolean>();
  readonly label = input.required<string>();
  readonly toggled = output<void>();
}

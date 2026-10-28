import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-overlay',
  imports: [LucideX],
  templateUrl: './overlay.html',
  styleUrl: './overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overlay {
  readonly open = input(false);
  readonly closed = output<void>();

  constructor() {
    // Prevent background scrolling while the overlay is open,
    // while still allowing the overlay content to scroll.
    effect((onCleanup) => {
      if (!this.open()) return;
      document.body.style.overflow = 'hidden';
      onCleanup(() => (document.body.style.overflow = ''));
    });
  }
}

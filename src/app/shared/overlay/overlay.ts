import { Component, effect, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-overlay',
  imports: [LucideX],
  templateUrl: './overlay.html',
  styleUrl: './overlay.scss',
})
export class Overlay {
  readonly open = input(false);
  readonly closed = output<void>();

  constructor() {
    // Prevent background scrolling while the overlay is open,
    // while still allowing the overlay content to scroll.
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });
  }
}

import { Component, input, output } from '@angular/core';
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
}

import { Component, inject } from '@angular/core';
import { LucideSearch } from '@lucide/angular';
import { OverlayStore } from '../../core/overlay/overlay.store';

@Component({
  imports: [LucideSearch],
  selector: 'app-search-button',
  styleUrl: './search-button.scss',
  templateUrl: './search-button.html',
})
export class SearchButton {
  protected readonly overlayStore = inject(OverlayStore);
}

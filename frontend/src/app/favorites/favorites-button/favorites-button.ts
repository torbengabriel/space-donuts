import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../favorites.store';
import { LucideHeart } from '@lucide/angular';
import { CountBadge } from '../../shared/count-badge/count-badge';
import { OverlayStore } from '../../core/overlay/overlay.store';

@Component({
  imports: [LucideHeart, CountBadge],
  selector: 'app-favorites-button',
  styleUrl: './favorites-button.scss',
  templateUrl: './favorites-button.html',
})
export class FavoritesButton {
  protected readonly overlayStore = inject(OverlayStore);
  protected readonly favoritesStore = inject(FavoritesStore);
}

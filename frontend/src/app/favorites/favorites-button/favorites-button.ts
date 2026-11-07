import { Component, inject } from '@angular/core';
import { FavoritesStore } from '../favorites.store';
import { LucideHeart } from '@lucide/angular';
import { CountBadge } from '../../shared/count-badge/count-badge';

@Component({
  imports: [LucideHeart, CountBadge],
  selector: 'app-favorites-button',
  styleUrl: './favorites-button.scss',
  templateUrl: './favorites-button.html',
})
export class FavoritesButton {
  protected readonly favoritesStore = inject(FavoritesStore);
}

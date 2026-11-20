import { Component, computed, inject } from '@angular/core';
import { FavoritesStore } from '../../store/favorites.store';
import { ProductStore } from '../../../products/store/product.store';

@Component({
  imports: [],
  selector: 'app-favorites-overlay',
  styleUrl: './favorites-overlay.scss',
  templateUrl: './favorites-overlay.html',
})
export class FavoritesOverlay {
  protected readonly favoritesStore = inject(FavoritesStore);
}

import { Component, computed, inject } from '@angular/core';
import { FavoritesStore } from '../favorites.store';
import { Overlay } from '../../shared/overlay/overlay';
import { ProductStore } from '../../products/product.store';

@Component({
  imports: [Overlay],
  selector: 'app-favorites-overlay',
  styleUrl: './favorites-overlay.scss',
  templateUrl: './favorites-overlay.html',
})
export class FavoritesOverlay {
  protected readonly favoritesStore = inject(FavoritesStore);
  private readonly productStore = inject(ProductStore);

  protected readonly favoriteDonuts = computed(() =>
    []
    //this.productStore.products().filter((product) => this.favoritesStore.isFavorite(product.id)),
  );
}

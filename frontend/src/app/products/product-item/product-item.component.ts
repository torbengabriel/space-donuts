import { Component, computed, inject, input } from '@angular/core';

import { Product } from '../product.model';
import { CurrencyPipe } from '@angular/common';
import { FavoritesStore } from '../../favorites/favorites.store';
import { FavoriteToggle } from '../../favorites/favorite-toggle/favorite-toggle.component';
import { AddToCart } from '../../cart/add-to-cart/add-to-cart';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
  imports: [CurrencyPipe, FavoriteToggle, AddToCart],
})
export class ProductItem {
  readonly product = input.required<Product>();

  protected readonly favoritesStore = inject(FavoritesStore);

  protected readonly isFavorite = computed(() =>
    this.favoritesStore.favoriteProductIds().includes(this.product().id),
  );
}

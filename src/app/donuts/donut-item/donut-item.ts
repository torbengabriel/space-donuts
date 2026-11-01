import { Component, computed, inject, input } from '@angular/core';

import { Donut } from '../donut.model';
import { CurrencyPipe } from '@angular/common';
import { AddToCart } from '../../cart/add-to-cart/add-to-cart';
import { FavoriteToggle } from '../../favorites/favorite-toggle/favorite-toggle.component';
import { FavoritesStore } from '../../favorites/favorites.store';

@Component({
  selector: 'app-donut-item',
  templateUrl: './donut-item.html',
  styleUrl: './donut-item.scss',
  imports: [CurrencyPipe, AddToCart, FavoriteToggle],
})
export class DonutItem {
  readonly donut = input.required<Donut>();

  protected readonly favoritesStore = inject(FavoritesStore);

  protected readonly isFavorite = computed(() =>
    this.favoritesStore.donutIds().includes(this.donut().id),
  );
}

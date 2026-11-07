import { Component, computed, inject } from '@angular/core';
import { FavoritesStore } from '../favorites.store';
import { Overlay } from '../../shared/overlay/overlay';
import { DonutsStore } from '../../donuts/donuts.store';
import { DonutItem } from '../../donuts/donut-item/donut-item';

@Component({
  imports: [Overlay, DonutItem],
  selector: 'app-favorites-overlay',
  styleUrl: './favorites-overlay.scss',
  templateUrl: './favorites-overlay.html',
})
export class FavoritesOverlay {
  protected readonly favoritesStore = inject(FavoritesStore);
  private readonly donutsStore = inject(DonutsStore);

  protected readonly favoriteDonuts = computed(() =>
    this.donutsStore.donuts().filter((donut) => this.favoritesStore.isFavorite(donut.id)),
  );
}

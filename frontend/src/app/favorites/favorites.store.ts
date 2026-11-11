import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface FavoritesState {
  favoriteProductIds: number[];
  isOpen: boolean;
}

export const FavoritesStore = signalStore(
  { providedIn: 'root' },

  withState<FavoritesState>({ favoriteProductIds: [], isOpen: false }),

  withComputed(({ favoriteProductIds }) => ({
    count: computed(() => favoriteProductIds().length),
    isEmpty: computed(() => favoriteProductIds().length === 0),
  })),

  withMethods((store) => {
    const isFavorite = (donutId: number): boolean => store.favoriteProductIds().includes(donutId);

    return {
      isFavorite,

      toggle(donutId: number): void {
        patchState(store, {
          favoriteProductIds: isFavorite(donutId)
            ? store.favoriteProductIds().filter((id) => id !== donutId)
            : [...store.favoriteProductIds(), donutId],
        });
      },

      openFavorites(): void {
        patchState(store, { isOpen: true });
      },

      closeFavorites(): void {
        patchState(store, { isOpen: false });
      },
    };
  }),
);

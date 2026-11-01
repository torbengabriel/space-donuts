import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface FavoritesState {
  donutIds: number[];
  isOpen: boolean;
}

export const FavoritesStore = signalStore(
  { providedIn: 'root' },

  withState<FavoritesState>({ donutIds: [], isOpen: false }),

  withComputed(({ donutIds }) => ({
    count: computed(() => donutIds().length),
  })),

  withMethods((store) => ({
    toggle(donutId: number): void {
      const isFavorite = store.donutIds().includes(donutId);

      patchState(store, {
        donutIds: isFavorite
          ? store.donutIds().filter((id) => id !== donutId)
          : [...store.donutIds(), donutId],
      });
    },
    openFavorites(): void {
      patchState(store, { isOpen: true });
    },
    closeFavorites(): void {
      patchState(store, { isOpen: false });
    },
  })),
);

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
    isEmpty: computed(() => donutIds().length === 0),
  })),

  withMethods((store) => {
    const isFavorite = (donutId: number): boolean => store.donutIds().includes(donutId);

    return {
      isFavorite,

      toggle(donutId: number): void {
        patchState(store, {
          donutIds: isFavorite(donutId)
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
    };
  }),
);

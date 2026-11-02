import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface SearchState {
  query: string;
  isOpen: boolean;
}

export const SearchStore = signalStore(
  { providedIn: 'root' },

  withState<SearchState>({ query: '', isOpen: false }),

  withComputed(({ query }) => ({
    hasQuery: computed(() => query().trim().length > 0),
  })),

  withMethods((store) => ({
    openSearch(): void {
      patchState(store, { isOpen: true });
    },
    closeSearch(): void {
      patchState(store, { isOpen: false });
    },
    setQuery(query: string): void {
      patchState(store, { query });
    },
    clear(): void {
      patchState(store, { query: '' });
    },
  })),
);

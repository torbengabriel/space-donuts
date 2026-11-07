import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withState } from '@ngrx/signals';

import { DonutService } from './services/donut';
import { Donut } from './donut.model';

interface DonutsState {
  donuts: Donut[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
}

export const DonutsStore = signalStore(
  { providedIn: 'root' },

  withState<DonutsState>({ donuts: [], status: 'idle' }),

  withComputed(({ status }) => ({
    isLoading: computed(() => status() === 'loading'),
    hasError: computed(() => status() === 'error'),
  })),

  withHooks({
    onInit(store) {
      const donutService = inject(DonutService);

      patchState(store, { status: 'loading' });

      donutService.getDonuts().subscribe({
        next: (donuts) => patchState(store, { donuts, status: 'loaded' }),
        error: () => patchState(store, { status: 'error' }),
      });
    },
  }),
);

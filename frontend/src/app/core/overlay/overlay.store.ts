import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { OverlayType } from './overlay.type';

interface OverlayState {
  activeOverlay: OverlayType | null;
}

const initialState: OverlayState = {
  activeOverlay: null,
};

export const OverlayStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => ({
    open(overlay: OverlayType): void {
      patchState(store, { activeOverlay: overlay });
    },

    close(): void {
      patchState(store, { activeOverlay: null });
    },

    isOpen(overlay: OverlayType): boolean {
      return store.activeOverlay() === overlay;
    },
  })),
);

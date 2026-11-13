import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface AuthState {
  isOpen: boolean;
}

const initialState: AuthState = {
  isOpen: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withMethods((store) => ({
    openLogin(): void {
      patchState(store, { isOpen: true });
    },

    closeLogin(): void {
      patchState(store, { isOpen: false });
    },
  })),
);

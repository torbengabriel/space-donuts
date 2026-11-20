import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface NotificationMessage {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

type NotificationStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface NotificationState {
  notifications: NotificationMessage[];
  activeToast: NotificationMessage | null;
  status: NotificationStatus;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  activeToast: null,
  status: 'idle',
  error: null,
};

export const NotificationStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => ({
    unreadCount: computed(
      () => store.notifications().filter((notification) => !notification.read).length,
    ),

    hasUnread: computed(() => store.notifications().some((notification) => !notification.read)),

    latestNotification: computed(() => store.notifications()[0] ?? null),
  })),

  withMethods((store) => ({
    addNotification(notification: NotificationMessage): void {
      patchState(store, {
        notifications: [
          notification,
          ...store.notifications().filter((existing) => existing.id !== notification.id),
        ],
        activeToast: notification,
        status: 'loaded',
        error: null,
      });
    },

    dismissToast(): void {
      patchState(store, {
        activeToast: null,
      });
    },

    markAsRead(id: number): void {
      patchState(store, {
        notifications: store
          .notifications()
          .map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
      });
    },

    setLoading(): void {
      patchState(store, {
        status: 'loading',
        error: null,
      });
    },

    setNotifications(notifications: NotificationMessage[]): void {
      patchState(store, {
        notifications,
        status: 'loaded',
        error: null,
      });
    },

    setError(error: string): void {
      patchState(store, {
        status: 'error',
        error,
      });
    },
  })),
);

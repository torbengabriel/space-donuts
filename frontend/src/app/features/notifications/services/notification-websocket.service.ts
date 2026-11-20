import { inject, Injectable, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationMessage, NotificationStore } from '../store/notification.store';

@Injectable({
  providedIn: 'root',
})
export class NotificationWebSocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationStore = inject(NotificationStore);
  private client?: Client;

  async connect(): Promise<void> {
    if (this.client?.active) {
      return;
    }

    const token = await this.authService.getValidToken();

    if (!token) {
      return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));

    console.log('WebSocket token details:', {
      exp: new Date(decoded.exp * 1000),
      iat: new Date(decoded.iat * 1000),
      sub: decoded.sub,
    });

    console.log('Token received for WebSocket:', {
      tokenExists: !!token,
      tokenLength: token.length,
    });

    this.client = new Client({
      brokerURL: 'ws://localhost:8081/ws',

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');

      this.client?.subscribe('/user/queue/notifications', (message) => {
        const notification: NotificationMessage = JSON.parse(message.body);

        this.notificationStore.addNotification(notification);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error(frame.body);
    };

    this.client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}

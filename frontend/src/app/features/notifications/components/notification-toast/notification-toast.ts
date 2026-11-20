import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-notification-toast',
  styleUrl: './notification-toast.scss',
  templateUrl: './notification-toast.html',
})
export class NotificationToast {
  title = input<string>('Notification');
  message = input<string>('');

  closed = output<void>();
}

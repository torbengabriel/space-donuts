import { Component, input } from '@angular/core';
import { Store, WEEKDAYS } from '../../services/store.model';

@Component({
  selector: 'app-store-card',
  standalone: true,
  templateUrl: './store-card.html',
  styleUrl: './store-card.scss',
})
export class StoreCardComponent {
  store = input.required<Store>();

  today = () => WEEKDAYS[new Date().getDay()];
}

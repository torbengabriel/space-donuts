import { Component, inject } from '@angular/core';
import { StoreService } from '../../features/stores/services/store.service';
import { AsyncPipe } from '@angular/common';
import { StoreCardComponent } from '../../features/stores/components/store-card/store-card';

@Component({
  imports: [AsyncPipe, StoreCardComponent],
  selector: 'app-stores',
  styleUrl: './stores.scss',
  templateUrl: './stores.html',
})
export class Stores {
  private storeService = inject(StoreService);

  stores$ = this.storeService.getStores();
}


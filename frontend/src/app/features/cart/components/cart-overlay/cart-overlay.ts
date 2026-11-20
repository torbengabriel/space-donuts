import { Component, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';
import { CurrencyPipe } from '@angular/common';
import { CartLine } from './cart-line/cart-line';
import { OrderApiService } from '../../../order/services/order-api.service';
import { OverlayStore } from '../../../../core/overlay/overlay.store';

@Component({
  imports: [CurrencyPipe, CartLine],
  selector: 'app-cart-overlay',
  styleUrl: './cart-overlay.scss',
  templateUrl: './cart-overlay.html',
})
export class CartOverlay {
  protected readonly cartStore = inject(CartStore);
  private readonly orderService = inject(OrderApiService);
  private readonly overlayStore = inject(OverlayStore)

  public checkout(): void {
    this.orderService.checkout().subscribe({
      next: () => {
        this.cartStore.loadCart();
        this.overlayStore.close();
      },
      error: (error) => {
        console.error('Checkout failed', error);
      },
    });
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quantity-selector',
  styleUrl: './quantity-selector.scss',
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  readonly quantity = input.required<number>();
  readonly quantityChange = output<number>();

  increaseQuantity(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }

  decreaseQuantity(): void {
    this.quantityChange.emit(this.quantity() - 1);
  }
}

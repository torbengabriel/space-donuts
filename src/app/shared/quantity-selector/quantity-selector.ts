import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quantity-selector',
  styleUrl: './quantity-selector.scss',
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  readonly quantity = input.required<number>();

  readonly increment = output<void>();
  readonly decrement = output<void>();

  increaseQuantity(): void {
    this.increment.emit();
  }

  decreaseQuantity(): void {
    this.decrement.emit();
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-quantity-selector',
  styleUrl: './quantity-selector.scss',
  templateUrl: './quantity-selector.html',
})
export class QuantitySelector {
  public quantity = input<number>(1);
  protected readonly quantityChange = output<number>();
  protected readonly remove = output<void>();

  protected increaseQuantity(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }

  protected decreaseQuantity(): void {
    if (this.quantity() === 1) {
      this.remove.emit();
      //return;
    }

    this.quantityChange.emit(this.quantity() - 1);
  }
}

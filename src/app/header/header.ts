import { Component, signal } from '@angular/core';
import { LucideShoppingCart } from '@lucide/angular';
import { Overlay } from '../shared/overlay/overlay';

@Component({
  imports: [LucideShoppingCart, Overlay],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly isCartOpen = signal(false);
}

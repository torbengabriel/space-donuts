import { Component, inject } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { CartButton } from '../cart/cart-button/cart-button';
import { FavoritesButton } from '../favorites/favorites-button/favorites-button';
import { SearchButton } from '../search/search-button/search-button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [CartButton, FavoritesButton, SearchButton, RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly cartStore = inject(CartStore);
}

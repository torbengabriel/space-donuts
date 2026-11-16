import { Component, inject } from '@angular/core';
import { CartStore } from '../cart/cart.store';
import { CartButton } from '../cart/cart-button/cart-button';
import { FavoritesButton } from '../favorites/favorites-button/favorites-button';
import { SearchButton } from '../search/search-button/search-button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../features/auth/store/auth.store';
import { LucideUserRound } from '@lucide/angular';
import { AuthService } from '../core/auth/auth.service';
import { ButtonDirective, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';

@Component({
  imports: [
    CartButton,
    FavoritesButton,
    SearchButton,
    RouterLink,
    RouterLinkActive,
    LucideUserRound,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownItemDirective,
    ButtonDirective,
    DropdownToggleDirective,
  ],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly cartStore = inject(CartStore);
  protected readonly authStore = inject(AuthStore);
  protected readonly authService = inject(AuthService);

  public onProfileClick(): void {}

  public logout(): void {
    this.authService.logout();
  }

  public openProfileOverlay(): void {

  };
}

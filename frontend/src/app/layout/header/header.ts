import { Component, inject } from '@angular/core';
import { CartButton } from '../../features/cart/components/cart-button/cart-button';
import { FavoritesButton } from '../../features/favorites/components/favorites-button/favorites-button';
import { SearchButton } from '../../features/search/components/search-button/search-button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideUserRound } from '@lucide/angular';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonDirective, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';
import { OverlayStore } from '../../core/overlay/overlay.store';

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
  protected readonly authService = inject(AuthService);
  protected readonly overlayStore = inject(OverlayStore);
}

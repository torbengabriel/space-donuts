import { Component, inject } from '@angular/core';
import { OverlayStore } from '../../../core/overlay/overlay.store';
import { Overlay } from '../overlay/overlay';
import { LoginOverlay } from '../../../features/auth/login-overlay/login-overlay';
import { ProfileOverlay } from '../../../features/profile/profile-overlay/profile-overlay';
import { CartOverlay } from '../../../cart/cart-overlay/cart-overlay';
import { FavoritesOverlay } from '../../../favorites/favorites-overlay/favorites-overlay';
import { SearchOverlay } from '../../../search/search-overlay/search-overlay';

@Component({
  imports: [Overlay, LoginOverlay, ProfileOverlay, CartOverlay, FavoritesOverlay, SearchOverlay],
  selector: 'app-overlay-container',
  styleUrl: './overlay-container.scss',
  templateUrl: './overlay-container.html',
})
export class OverlayContainer {
  protected readonly overlayStore = inject(OverlayStore);
}

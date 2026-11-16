import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../store/auth.store';
import { Overlay } from '../../../shared/overlay/overlay';
import { LucideLogIn, LucideUserRound } from '@lucide/angular';

@Component({
  imports: [Overlay, LucideUserRound, LucideLogIn],
  selector: 'app-login-overlay',
  styleUrl: './login-overlay.scss',
  templateUrl: './login-overlay.html',
})
export class LoginOverlay {
  protected readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}

import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { LucideLogIn, LucideUserRound } from '@lucide/angular';

@Component({
  imports: [LucideUserRound, LucideLogIn],
  selector: 'app-login-overlay',
  styleUrl: './login-overlay.scss',
  templateUrl: './login-overlay.html',
})
export class LoginOverlay {
  private readonly authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}

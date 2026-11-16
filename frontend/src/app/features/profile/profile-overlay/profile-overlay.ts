import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { UserProfile } from '../profile.model';

@Component({
  selector: 'app-profile-overlay',
  templateUrl: './profile-overlay.html',
  styleUrl: './profile-overlay.scss',
})
export class ProfileOverlay implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly profile = signal<UserProfile | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    void this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.profile.set(await this.authService.getUserProfile());
    this.loading.set(false);
  }
}

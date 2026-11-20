import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../features/profile/models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: environment.keycloakUrl,
    realm: 'space-donuts',
    clientId: 'space-donuts-frontend',
  });

  async init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    });
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  get isLoggedIn(): boolean {
    return !!this.keycloak.authenticated;
  }

  get username(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'] as string | undefined;
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async getValidToken(): Promise<string | null> {
    if (!this.keycloak.authenticated) {
      return null;
    }

    //await this.keycloak.updateToken(30);

    const refreshed = await this.keycloak.updateToken(30);

    console.log('Token refresh result:', refreshed);
    console.log(
      'Token expiration:',
      this.keycloak.tokenParsed?.exp ? new Date(this.keycloak.tokenParsed.exp * 1000) : null,
    );

    return this.keycloak.token ?? null;
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.keycloak.authenticated) {
      return null;
    }

    try {
      await this.keycloak.updateToken(30);

      return await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Could not load user profile', error);
      return null;
    }
  }
}

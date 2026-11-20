import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Keycloak from 'keycloak-js';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const { keycloakMock } = vi.hoisted(() => ({
  keycloakMock: {
    init: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateToken: vi.fn(),
    loadUserProfile: vi.fn(),
    hasRealmRole: vi.fn(),
    authenticated: false,
    token: undefined as string | undefined,
    tokenParsed: undefined as Record<string, unknown> | undefined,
  },
}));

vi.mock('keycloak-js', () => ({
  default: vi.fn(() => keycloakMock),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    keycloakMock.authenticated = false;
    keycloakMock.token = undefined;
    keycloakMock.tokenParsed = undefined;

    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
  });

  describe('init', () => {
    it('should initialize Keycloak with the correct configuration', async () => {
      keycloakMock.init.mockResolvedValue(true);

      const result = await service.init();

      expect(Keycloak).toHaveBeenCalledWith({
        url: environment.keycloakUrl,
        realm: 'space-donuts',
        clientId: 'space-donuts-frontend',
      });

      expect(keycloakMock.init).toHaveBeenCalledWith({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
      });

      expect(result).toBe(true);
    });
  });

  describe('login', () => {
    it('should call Keycloak login', () => {
      service.login();

      expect(keycloakMock.login).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call Keycloak logout with the current origin as redirect URI', () => {
      service.logout();

      expect(keycloakMock.logout).toHaveBeenCalledWith({
        redirectUri: window.location.origin,
      });
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if the user is authenticated', () => {
      keycloakMock.authenticated = true;

      expect(service.isLoggedIn).toBe(true);
    });

    it('should return false if the user is not authenticated', () => {
      keycloakMock.authenticated = false;

      expect(service.isLoggedIn).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if the user has the requested role', () => {
      keycloakMock.hasRealmRole.mockReturnValue(true);

      const result = service.hasRole('ADMIN');

      expect(keycloakMock.hasRealmRole).toHaveBeenCalledWith('ADMIN');
      expect(result).toBe(true);
    });

    it('should return false if the user does not have the requested role', () => {
      keycloakMock.hasRealmRole.mockReturnValue(false);

      const result = service.hasRole('ADMIN');

      expect(keycloakMock.hasRealmRole).toHaveBeenCalledWith('ADMIN');
      expect(result).toBe(false);
    });
  });

  describe('getValidToken', () => {
    it('should return null if the user is not authenticated', async () => {
      keycloakMock.authenticated = false;

      const result = await service.getValidToken();

      expect(result).toBeNull();
      expect(keycloakMock.updateToken).not.toHaveBeenCalled();
    });

    it('should refresh the token and return it if the user is authenticated', async () => {
      const token = 'test-token';

      keycloakMock.authenticated = true;
      keycloakMock.token = token;
      keycloakMock.updateToken.mockResolvedValue(true);

      const result = await service.getValidToken();

      expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
      expect(result).toBe(token);
    });

    it('should return null if no token is available after refreshing', async () => {
      keycloakMock.authenticated = true;
      keycloakMock.token = undefined;
      keycloakMock.updateToken.mockResolvedValue(false);

      const result = await service.getValidToken();

      expect(result).toBeNull();
    });
  });

  describe('getUserProfile', () => {
    it('should return null if the user is not authenticated', async () => {
      keycloakMock.authenticated = false;

      const result = await service.getUserProfile();

      expect(result).toBeNull();
      expect(keycloakMock.updateToken).not.toHaveBeenCalled();
      expect(keycloakMock.loadUserProfile).not.toHaveBeenCalled();
    });

    it('should refresh the token and return the user profile', async () => {
      const profile = {
        id: '123',
        username: 'test-user',
        email: 'test@example.com',
      };

      keycloakMock.authenticated = true;
      keycloakMock.updateToken.mockResolvedValue(false);
      keycloakMock.loadUserProfile.mockResolvedValue(profile);

      const result = await service.getUserProfile();

      expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
      expect(keycloakMock.loadUserProfile).toHaveBeenCalled();
      expect(result).toEqual(profile);
    });

    it('should return null if loading the profile fails', async () => {
      keycloakMock.authenticated = true;
      keycloakMock.updateToken.mockResolvedValue(false);
      keycloakMock.loadUserProfile.mockRejectedValue(new Error('Profile loading failed'));

      const result = await service.getUserProfile();

      expect(result).toBeNull();
    });

    it('should return null if token refresh fails', async () => {
      keycloakMock.authenticated = true;
      keycloakMock.updateToken.mockRejectedValue(new Error('Token refresh failed'));

      const result = await service.getUserProfile();

      expect(result).toBeNull();
      expect(keycloakMock.loadUserProfile).not.toHaveBeenCalled();
    });
  });
});

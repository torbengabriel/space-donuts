import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let authServiceMock: {
    getValidToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = {
      getValidToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });
  });

  it('should forward external requests without requesting a token', async () => {
    const request = new HttpRequest('GET', 'https://example.com/api');
    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    await firstValueFrom(TestBed.runInInjectionContext(() => authInterceptor(request, next)));

    expect(next).toHaveBeenCalledWith(request);
    expect(authServiceMock.getValidToken).not.toHaveBeenCalled();
  });

  it('should forward backend requests without an authorization header if no token exists', async () => {
    const request = new HttpRequest('GET', `${environment.apiUrl}/products`);

    authServiceMock.getValidToken.mockResolvedValue(null);

    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    await firstValueFrom(TestBed.runInInjectionContext(() => authInterceptor(request, next)));

    expect(next).toHaveBeenCalledWith(request);
    expect(request.headers.has('Authorization')).toBe(false);
  });

  it('should add a bearer token to backend requests', async () => {
    const token = 'test-token';

    const request = new HttpRequest('GET', `${environment.apiUrl}/products`);

    authServiceMock.getValidToken.mockResolvedValue(token);

    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    await firstValueFrom(TestBed.runInInjectionContext(() => authInterceptor(request, next)));

    const forwardedRequest = next.mock.calls[0][0];

    expect(forwardedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(forwardedRequest).not.toBe(request);
  });

  it('should not modify the original request when adding the token', async () => {
    const token = 'test-token';

    const request = new HttpRequest('GET', `${environment.apiUrl}/products`);

    authServiceMock.getValidToken.mockResolvedValue(token);

    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    await firstValueFrom(TestBed.runInInjectionContext(() => authInterceptor(request, next)));

    expect(request.headers.has('Authorization')).toBe(false);
  });
});

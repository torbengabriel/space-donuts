import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authServiceMock: { isLoggedIn: boolean };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  const executeGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: false,
    };

    routerMock = {
      createUrlTree: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow access if the user is logged in', () => {
    authServiceMock.isLoggedIn = true;

    const result = executeGuard();

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to the home page if the user is not logged in', () => {
    const urlTree = {} as UrlTree;

    authServiceMock.isLoggedIn = false;
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = executeGuard();

    expect(result).toBe(urlTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});

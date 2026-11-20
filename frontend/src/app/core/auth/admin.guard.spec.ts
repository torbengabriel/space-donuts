import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';

describe('adminGuard', () => {
  let authServiceMock: {
    hasRole: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    createUrlTree: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = {
      hasRole: vi.fn(),
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

  it('should allow access if the user has the ADMIN role', () => {
    authServiceMock.hasRole.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(result).toBe(true);
    expect(authServiceMock.hasRole).toHaveBeenCalledWith('ADMIN');
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to the home page if the user does not have the ADMIN role', () => {
    const urlTree = {} as UrlTree;

    authServiceMock.hasRole.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(result).toBe(urlTree);
    expect(authServiceMock.hasRole).toHaveBeenCalledWith('ADMIN');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});

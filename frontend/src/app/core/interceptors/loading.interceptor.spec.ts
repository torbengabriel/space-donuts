import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let loadingServiceMock: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    loadingServiceMock = {
      show: vi.fn(),
      hide: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
    });
  });

  const executeInterceptor = (
    request: HttpRequest<unknown>,
    next: (req: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>,
  ) => TestBed.runInInjectionContext(() => loadingInterceptor(request, next));

  it('should call show when a request is intercepted', () => {
    const request = new HttpRequest('GET', '/api/products');
    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    executeInterceptor(request, next);

    expect(loadingServiceMock.show).toHaveBeenCalledOnce();
  });

  it('should forward the request to next', () => {
    const request = new HttpRequest('GET', '/api/products');
    const response = new HttpResponse();
    const next = vi.fn().mockReturnValue(of(response));

    const result$ = executeInterceptor(request, next);

    expect(next).toHaveBeenCalledWith(request);
    expect(result$).toBeDefined();
  });

  it('should call hide when the request completes successfully', () => {
    const request = new HttpRequest('GET', '/api/products');
    const next = vi.fn().mockReturnValue(of(new HttpResponse()));

    executeInterceptor(request, next).subscribe();

    expect(loadingServiceMock.show).toHaveBeenCalledOnce();
    expect(loadingServiceMock.hide).toHaveBeenCalledOnce();
  });

  it('should call hide when the request fails', () => {
    const request = new HttpRequest('GET', '/api/products');
    const next = vi.fn().mockReturnValue(throwError(() => new Error('Request failed')));

    executeInterceptor(request, next).subscribe({
      error: () => {},
    });

    expect(loadingServiceMock.show).toHaveBeenCalledOnce();
    expect(loadingServiceMock.hide).toHaveBeenCalledOnce();
  });
});

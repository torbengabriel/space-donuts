import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new LoadingService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with loading set to false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set loading to true when show is called', () => {
    service.show();

    expect(service.isLoading()).toBe(true);
  });

  it('should keep loading true while requests are still active', () => {
    service.show();
    service.show();

    service.hide();

    vi.advanceTimersByTime(500);

    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false after 500ms when all requests are finished', () => {
    service.show();
    service.hide();

    vi.advanceTimersByTime(499);

    expect(service.isLoading()).toBe(true);

    vi.advanceTimersByTime(1);

    expect(service.isLoading()).toBe(false);
  });

  it('should cancel the pending hide timer when a new request starts', () => {
    service.show();
    service.hide();

    vi.advanceTimersByTime(300);

    service.show();

    vi.advanceTimersByTime(500);

    expect(service.isLoading()).toBe(true);
  });

  it('should only hide loading after all concurrent requests have finished', () => {
    service.show();
    service.show();
    service.show();

    service.hide();
    service.hide();

    vi.advanceTimersByTime(500);

    expect(service.isLoading()).toBe(true);

    service.hide();

    vi.advanceTimersByTime(499);

    expect(service.isLoading()).toBe(true);

    vi.advanceTimersByTime(1);

    expect(service.isLoading()).toBe(false);
  });

  it('should not allow the active request count to become negative', () => {
    service.hide();
    service.hide();

    vi.advanceTimersByTime(500);

    expect(service.isLoading()).toBe(false);
  });
});

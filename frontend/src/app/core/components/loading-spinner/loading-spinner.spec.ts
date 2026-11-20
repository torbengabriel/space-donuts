import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { LoadingSpinnerComponent } from './loading-spinner';
import { LoadingService } from '../../services/loading.service';

describe('LoadingSpinnerComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<LoadingSpinnerComponent>>;
  let loadingServiceMock: { isLoading: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    loadingServiceMock = {
      isLoading: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [{ provide: LoadingService, useValue: loadingServiceMock }],
    });

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
  });

  it('should not render the loading overlay when loading is false', () => {
    loadingServiceMock.isLoading.mockReturnValue(false);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading-overlay')).toBeNull();
  });

  it('should render the loading overlay when loading is true', () => {
    loadingServiceMock.isLoading.mockReturnValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.loading-overlay')).not.toBeNull();
  });

  it('should display the loading message', () => {
    loadingServiceMock.isLoading.mockReturnValue(true);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Preparing something delicious...');
  });

  it('should render the spinner image', () => {
    loadingServiceMock.isLoading.mockReturnValue(true);

    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('.donut-spinner');

    expect(image).not.toBeNull();
    expect(image.getAttribute('src')).toBe('/images/space-donuts-spinner.png');
    expect(image.getAttribute('alt')).toBe('');
  });

  it('should expose the loading status for accessibility', () => {
    loadingServiceMock.isLoading.mockReturnValue(true);

    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]');

    expect(status).not.toBeNull();
    expect(status.getAttribute('aria-label')).toBe('Loading');
  });
});

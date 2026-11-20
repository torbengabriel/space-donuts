import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { OverlayStore } from './overlay.store';
import { OverlayType } from './overlay.type';

describe('OverlayStore', () => {
  let store: InstanceType<typeof OverlayStore>;

  const overlayA = 'overlay-a' as OverlayType;
  const overlayB = 'overlay-b' as OverlayType;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverlayStore],
    });

    store = TestBed.inject(OverlayStore);
  });

  it('should initialize with no active overlay', () => {
    expect(store.activeOverlay()).toBeNull();
  });

  it('should open an overlay', () => {
    store.open(overlayA);

    expect(store.activeOverlay()).toBe(overlayA);
  });

  it('should replace the currently active overlay when opening another one', () => {
    store.open(overlayA);
    store.open(overlayB);

    expect(store.activeOverlay()).toBe(overlayB);
  });

  it('should close the active overlay', () => {
    store.open(overlayA);
    store.close();

    expect(store.activeOverlay()).toBeNull();
  });

  it('should return true when the requested overlay is open', () => {
    store.open(overlayA);

    expect(store.isOpen(overlayA)).toBe(true);
  });

  it('should return false when a different overlay is open', () => {
    store.open(overlayA);

    expect(store.isOpen(overlayB)).toBe(false);
  });

  it('should return false when no overlay is open', () => {
    expect(store.isOpen(overlayA)).toBe(false);
  });
});

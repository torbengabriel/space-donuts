import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesStore } from '../favorites.store';
import { FavoritesButton } from './favorites-button';

describe('FavoritesButton', () => {
  let fixture: ComponentFixture<FavoritesButton>;
  let store: InstanceType<typeof FavoritesStore>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FavoritesButton] }).compileComponents();

    store = TestBed.inject(FavoritesStore);
    fixture = TestBed.createComponent(FavoritesButton);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('opens the favorites overlay on click', () => {
    element.querySelector('button')!.click();

    expect(store.isOpen()).toBe(true);
  });

  it('includes the number of favorites in its accessible name', async () => {
    store.toggle(1);
    store.toggle(2);
    await fixture.whenStable();

    expect(element.querySelector('button')!.getAttribute('aria-label')).toBe('Favorites, 2 donuts');
  });

  it('shows the number of favorites in the badge', async () => {
    store.toggle(1);
    store.toggle(2);
    await fixture.whenStable();

    expect(element.querySelector('.count-badge')!.textContent).toBe('2');
  });

  it('shows no badge without favorites', () => {
    expect(element.querySelector('.count-badge')).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';
import { FavoritesStore } from './favorites.store';


describe('FavoritesStore', () => {
  let store: InstanceType<typeof FavoritesStore>;

  beforeEach(() => {
    store = TestBed.inject(FavoritesStore);
  });

  it('starts without favorites', () => {
    expect(store.donutIds()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('adds a donut to the favorites when toggled', () => {
    store.toggle(1);

    expect(store.donutIds()).toEqual([1]);
    expect(store.count()).toBe(1);
  });

  it('removes a donut from the favorites when toggled twice', () => {
    store.toggle(1);
    store.toggle(1);

    expect(store.donutIds()).toEqual([]);
  });

  it('opens and closes the favorites overlay', () => {
    store.openFavorites();
    expect(store.isOpen()).toBe(true);
    store.closeFavorites();
    expect(store.isOpen()).toBe(false);
  });
});

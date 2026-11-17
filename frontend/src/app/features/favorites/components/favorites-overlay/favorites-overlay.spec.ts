import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesOverlay } from './favorites-overlay';

describe('FavoritesOverlay', () => {
  let component: FavoritesOverlay;
  let fixture: ComponentFixture<FavoritesOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

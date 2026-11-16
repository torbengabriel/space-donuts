import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileOverlay } from './profile-overlay';

describe('ProfileOverlay', () => {
  let component: ProfileOverlay;
  let fixture: ComponentFixture<ProfileOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

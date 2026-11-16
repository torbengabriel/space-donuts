import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from './overlay-container';

describe('OverlayContainer', () => {
  let component: OverlayContainer;
  let fixture: ComponentFixture<OverlayContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

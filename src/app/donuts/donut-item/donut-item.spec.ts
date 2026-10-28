import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutItemComponent } from './donut-item';

describe('DonutItem', () => {
  let component: DonutItemComponent;
  let fixture: ComponentFixture<DonutItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

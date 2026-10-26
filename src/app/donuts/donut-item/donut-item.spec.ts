import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutItem } from './donut-item';

describe('DonutItem', () => {
  let component: DonutItem;
  let fixture: ComponentFixture<DonutItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutItem],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

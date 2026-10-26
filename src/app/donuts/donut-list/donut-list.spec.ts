import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutList } from './donut-list';

describe('DonutList', () => {
  let component: DonutList;
  let fixture: ComponentFixture<DonutList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutList],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

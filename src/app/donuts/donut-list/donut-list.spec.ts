import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Donut } from '../models/donut.model';
import { DonutService } from '../services/donut';
import { DonutList } from './donut-list';

const donuts: Donut[] = [
  { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
  { id: 2, title: 'Choco', description: 'Rich', price: 3, image: 'choco.png' },
];

describe('DonutList', () => {
  let fixture: ComponentFixture<DonutList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutList],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutList);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('renders one donut item per donut', () => {
    expect(element.querySelectorAll('app-donut-item').length).toBe(2);
  });

  it('renders the donuts in a list', () => {
    expect(element.querySelectorAll('ul > li').length).toBe(2);
  });

  it('shows the titles of all donuts', () => {
    expect(element.textContent).toContain('Glazed');
    expect(element.textContent).toContain('Choco');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Product } from '../product.model';
import { ProductService } from '../services/product.service';
import { ProductList } from './product-list.component';

const donuts: Product[] = [
  { id: 1, title: 'Glazed', description: 'Sweet', price: 2.5, image: 'glazed.png' },
  { id: 2, title: 'Choco', description: 'Rich', price: 3, image: 'choco.png' },
];

describe('DonutList', () => {
  let fixture: ComponentFixture<ProductList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [{ provide: ProductService, useValue: { getDonuts: () => of(donuts) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('renders one donut item per donut', () => {
    expect(element.querySelectorAll('app-product-item').length).toBe(2);
  });

  it('renders the products in a list', () => {
    expect(element.querySelectorAll('ul > li').length).toBe(2);
  });

  it('shows the titles of all products', () => {
    expect(element.textContent).toContain('Glazed');
    expect(element.textContent).toContain('Choco');
  });
});

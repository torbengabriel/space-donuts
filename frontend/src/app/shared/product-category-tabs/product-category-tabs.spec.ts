import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryTabs } from './product-category-tabs';

describe('ProductCategoryTabs', () => {
  let component: ProductCategoryTabs;
  let fixture: ComponentFixture<ProductCategoryTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryTabs],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCategoryTabs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

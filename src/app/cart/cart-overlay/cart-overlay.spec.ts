import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartOverlay } from './cart-overlay';

describe('CartOverlay', () => {
  let component: CartOverlay;
  let fixture: ComponentFixture<CartOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(CartOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

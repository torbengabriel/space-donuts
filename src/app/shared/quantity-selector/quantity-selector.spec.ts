import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuantitySelector } from './quantity-selector';

describe('QuantitySelector', () => {
  let fixture: ComponentFixture<QuantitySelector>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantitySelector],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantitySelector);
    fixture.componentRef.setInput('quantity', 2);
    await fixture.whenStable();

    element = fixture.nativeElement;
  });

  it('displays the current quantity', () => {
    expect(element.querySelector('span')!.textContent).toBe('2');
  });

  it('updates the displayed quantity when the input changes', async () => {
    fixture.componentRef.setInput('quantity', 7);
    await fixture.whenStable();

    expect(element.querySelector('span')!.textContent).toBe('7');
  });

  it('emits increment when the plus button is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.increment.subscribe(spy);

    element.querySelector<HTMLButtonElement>('[aria-label="Increase quantity"]')!.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits decrement when the minus button is clicked', () => {
    const spy = vi.fn();
    fixture.componentInstance.decrement.subscribe(spy);

    element.querySelector<HTMLButtonElement>('[aria-label="Decrease quantity"]')!.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

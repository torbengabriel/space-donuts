import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountBadge } from './count-badge';

describe('CountBadge', () => {
  let fixture: ComponentFixture<CountBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountBadge],
    }).compileComponents();
    fixture = TestBed.createComponent(CountBadge);
  });

  async function render(count: number): Promise<HTMLElement> {
    fixture.componentRef.setInput('count', count);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('shows the count when it is greater than 0', async () => {
    fixture.componentRef.setInput('count', 3);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.count-badge')!.textContent).toBe('3');
  });

  it('renders nothing when the count is 0', async () => {
    const element = await render(0);

    expect(element.querySelector('.count-badge')).toBeNull();
  });
});

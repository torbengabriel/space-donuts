import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

import { About } from './about';
import { TimelineComponent } from '../../components/timeline/timeline';
import { SPACE_DONUTS_HISTORY } from '../../data/space-donuts-timeline';

describe('About', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<About>>;
  let component: About;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [About],
    });

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the history section heading', () => {
    const heading = fixture.nativeElement.querySelector('h2');

    expect(heading.textContent.trim()).toBe('Our Journey');
  });

  it('should render the history description', () => {
    const paragraph = fixture.nativeElement.querySelector('p');

    expect(paragraph.textContent).toContain(
      'More than 200 years of passion, creativity and extraordinary donuts.',
    );
  });

  it('should render the TimelineComponent', () => {
    const timeline = fixture.debugElement.query(By.directive(TimelineComponent));

    expect(timeline).not.toBeNull();
  });

  it('should pass the history data to the TimelineComponent', () => {
    const timeline = fixture.debugElement.query(By.directive(TimelineComponent));

    expect(timeline.componentInstance.items()).toEqual(SPACE_DONUTS_HISTORY);
  });

  it('should pass all history entries to the TimelineComponent', () => {
    const timeline = fixture.debugElement.query(By.directive(TimelineComponent));

    expect(timeline.componentInstance.items().length).toBe(SPACE_DONUTS_HISTORY.length);
  });
});

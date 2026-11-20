import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimelineComponent } from './timeline';
import { TimelineItem } from './timeline.model';

describe('TimelineComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<TimelineComponent>>;
  let component: TimelineComponent;

  const timelineItems: TimelineItem[] = [
    {
      id: '1815',
      date: '1815',
      title: 'The Beginning',
      description: 'Our first little donut shop opened its doors.',
      imageUrl: '/images/timeline/1815-first-bakery.png',
      color: '#999999',
      icon: '🍩',
    },
    {
      id: '1985',
      date: '1985',
      title: 'A Family Tradition',
      description: 'The little shop became a local favorite.',
      imageUrl: '/images/timeline/1847-secret-recipe.png',
      color: '#eab308',
      icon: '❤️',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimelineComponent],
    });

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('items', timelineItems);
    fixture.detectChanges();
  });

  it('should render all timeline items', () => {
    const items = fixture.nativeElement.querySelectorAll('.timeline-item');

    expect(items.length).toBe(2);
  });

  it('should render the correct title and date for each item', () => {
    const items = fixture.nativeElement.querySelectorAll('.timeline-item');

    expect(items[0].textContent).toContain('The Beginning');
    expect(items[0].textContent).toContain('1815');

    expect(items[1].textContent).toContain('A Family Tradition');
    expect(items[1].textContent).toContain('1985');
  });

  it('should render the correct descriptions', () => {
    const items = fixture.nativeElement.querySelectorAll('.timeline-item');

    expect(items[0].textContent).toContain('Our first little donut shop opened its doors.');

    expect(items[1].textContent).toContain('The little shop became a local favorite.');
  });

  it('should alternate timeline items between top and bottom', () => {
    const items = fixture.nativeElement.querySelectorAll('.timeline-item');

    expect(items[0].classList.contains('top')).toBe(true);
    expect(items[0].classList.contains('bottom')).toBe(false);

    expect(items[1].classList.contains('bottom')).toBe(true);
    expect(items[1].classList.contains('top')).toBe(false);
  });

  it('should render an image when imageUrl is provided', () => {
    const images = fixture.nativeElement.querySelectorAll('.timeline-image');

    expect(images.length).toBe(2);
    expect(images[0].getAttribute('src')).toBe('/images/timeline/1815-first-bakery.png');
    expect(images[0].getAttribute('alt')).toBe('The Beginning');
    expect(images[0].getAttribute('loading')).toBe('lazy');
  });

  it('should not render an image when imageUrl is missing', () => {
    const itemsWithoutImages: TimelineItem[] = [
      {
        id: 'test',
        date: '2026',
        title: 'No Image',
        description: 'This timeline item has no image.',
      },
    ];

    fixture.componentRef.setInput('items', itemsWithoutImages);
    fixture.detectChanges();

    const images = fixture.nativeElement.querySelectorAll('.timeline-image');

    expect(images.length).toBe(0);
  });

  it('should render the item icon when provided', () => {
    const markers = fixture.nativeElement.querySelectorAll('.timeline-marker');

    expect(markers[0].textContent).toContain('🍩');
    expect(markers[1].textContent).toContain('❤️');
  });

  it('should render a marker dot when no icon is provided', () => {
    const itemsWithoutIcons: TimelineItem[] = [
      {
        id: 'test',
        date: '2026',
        title: 'No Icon',
        description: 'This timeline item has no icon.',
      },
    ];

    fixture.componentRef.setInput('items', itemsWithoutIcons);
    fixture.detectChanges();

    const markerDot = fixture.nativeElement.querySelector('.marker-dot');

    expect(markerDot).not.toBeNull();
  });

  it('should apply the provided marker color', () => {
    const markers = fixture.nativeElement.querySelectorAll('.timeline-marker');

    expect(markers[0].style.getPropertyValue('--marker-color')).toBe('#999999');
    expect(markers[1].style.getPropertyValue('--marker-color')).toBe('#eab308');
  });

  it('should use the default marker color when no color is provided', () => {
    const itemsWithoutColor: TimelineItem[] = [
      {
        id: 'test',
        date: '2026',
        title: 'No Color',
        description: 'This timeline item has no color.',
      },
    ];

    fixture.componentRef.setInput('items', itemsWithoutColor);
    fixture.detectChanges();

    const marker = fixture.nativeElement.querySelector('.timeline-marker');

    expect(marker.style.getPropertyValue('--marker-color')).toBe('#ec4899');
  });

  it('should have an accessible aria-label on each marker', () => {
    const markers = fixture.nativeElement.querySelectorAll('.timeline-marker');

    expect(markers[0].getAttribute('aria-label')).toBe('Meilenstein: The Beginning');

    expect(markers[1].getAttribute('aria-label')).toBe('Meilenstein: A Family Tradition');
  });

  it('should emit the selected timeline item when a marker is clicked', () => {
    const emitSpy = vi.spyOn(component['itemSelected'], 'emit');

    const marker = fixture.nativeElement.querySelector('.timeline-marker');
    marker.click();

    expect(emitSpy).toHaveBeenCalledWith(timelineItems[0]);
  });
});

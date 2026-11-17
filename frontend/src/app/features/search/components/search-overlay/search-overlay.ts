import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { SearchStore } from '../../store/search.store';

@Component({
  imports: [],
  selector: 'app-search-overlay',
  styleUrl: './search-overlay.scss',
  templateUrl: './search-overlay.html',
})
export class SearchOverlay {
  protected readonly searchStore = inject(SearchStore);
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor() {
    // The input only exists while the overlay is open, so focus it as soon as it appears.
    effect(() => this.field()?.nativeElement.focus());
  }
}

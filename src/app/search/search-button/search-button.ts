import { Component, inject } from '@angular/core';
import { SearchStore } from '../search.store';
import { LucideSearch } from '@lucide/angular';

@Component({
  imports: [LucideSearch],
  selector: 'app-search-button',
  styleUrl: './search-button.scss',
  templateUrl: './search-button.html',
})
export class SearchButton {
  protected readonly searchStore = inject(SearchStore);
}

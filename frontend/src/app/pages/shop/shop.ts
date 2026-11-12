import { Component } from '@angular/core';
import { ProductCategoryTabsComponent } from '../../shared/product-category-tabs/product-category-tabs';

@Component({
  imports: [ProductCategoryTabsComponent],
  selector: 'app-shop',
  styleUrl: './shop.scss',
  templateUrl: './shop.html',
})
export class Shop {}

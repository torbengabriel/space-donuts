import { Component } from '@angular/core';
import { ProductCategoryTabsComponent } from '../../components/product-category-tabs/product-category-tabs';

@Component({
  imports: [ProductCategoryTabsComponent],
  selector: 'app-shop',
  styleUrl: './shop.scss',
  templateUrl: './shop.html',
})
export class Shop {}

import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';

import { ProductItem } from '../product-item/product-item.component';
import { ProductStore } from '../product.store';
import { ProductCategory } from '../product-category.model';

@Component({
  selector: 'app-product-list',
  imports: [ProductItem],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList implements OnInit {
  protected readonly productStore = inject(ProductStore);

  public readonly category = input.required<ProductCategory>();

  products = computed(() => this.productStore.products()[this.category()]);

  isLoading = computed(() => this.productStore.loadingCategories().includes(this.category()));

  ngOnInit(): void {
    this.productStore.loadProducts(this.category());
  }
}

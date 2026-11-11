import { Component, output } from '@angular/core';
import { ProductList } from '../../products/product-list/product-list.component';
import { ProductCategory } from '../../products/product-category.model';
import { TabDirective, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent } from '@coreui/angular';

@Component({
  selector: 'app-product-category-tabs',
  standalone: true,
  imports: [
    ProductList,
    TabsComponent,
    TabsListComponent,
    TabsContentComponent,
    TabPanelComponent,
    TabDirective,
  ],
  templateUrl: './product-category-tabs.html',
  styleUrl: './product-category-tabs.scss',
})
export class ProductCategoryTabsComponent {
  categoryChange = output<string>();

  protected readonly ProductCategory = ProductCategory;
}

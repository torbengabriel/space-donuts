import { Component, output } from '@angular/core';
import { ProductList } from '../../products/product-list/product-list.component';
import { ProductCategory } from '../../products/product-category.model';
import { NavComponent, TabContentComponent,
  TabContentRefDirective,
  TabDirective, TabPaneComponent, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent } from '@coreui/angular';
import { cilHome } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-product-category-tabs',
  standalone: true,
  imports: [
    ProductList,
    TabsComponent,
    TabsListComponent,
    TabsContentComponent,
    TabPanelComponent,
    TabPaneComponent,
    NavComponent,
    TabContentRefDirective,
    TabContentComponent,
    IconDirective,
    TabDirective,
  ],
  templateUrl: './product-category-tabs.html',
  styleUrl: './product-category-tabs.scss',
})
export class ProductCategoryTabsComponent {
  categoryChange = output<string>();

  protected readonly ProductCategory = ProductCategory;

  activeTab = 0;

  cilHome = cilHome;

  handleChange($event: string | number | undefined) {
    console.log('handleChange', $event);
  }

  onCategoryChange(index: number): void {
    const categories = ['DONUT', 'DONUT_BOX', 'COFFEE', 'BAKERY'];

    this.categoryChange.emit(categories[index]);
  }
}

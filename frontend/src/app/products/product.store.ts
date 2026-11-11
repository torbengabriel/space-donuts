import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { ProductService } from './services/product.service';
import { Product } from './product.model';
import { ProductCategory } from './product-category.model';

interface ProductsState {
  products: Record<ProductCategory, Product[]>;
  loadedCategories: ProductCategory[];
  loadingCategories: ProductCategory[];
  errors: Partial<Record<ProductCategory, string>>;
}

const initialState: ProductsState = {
  products: {
    DONUT: [],
    DONUT_BOX: [],
    COFFEE: [],
    BAKERY: [],
  },
  loadedCategories: [],
  loadingCategories: [],
  errors: {},
};

export const ProductStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ loadingCategories, loadedCategories, errors }) => ({
    isLoading: computed(() => loadingCategories().length > 0),

    hasLoadedProducts: computed(() => loadedCategories().length > 0),

    hasError: computed(() => Object.values(errors()).some((error) => error !== undefined)),
  })),

  withMethods((store, productService = inject(ProductService)) => ({
    loadProducts(category: ProductCategory): void {
      // Bereits geladen? Dann keinen weiteren API-Aufruf starten.
      if (store.loadedCategories().includes(category)) {
        return;
      }

      // Läuft bereits ein Request für diese Kategorie?
      if (store.loadingCategories().includes(category)) {
        return;
      }

      patchState(store, (state) => ({
        loadingCategories: [...state.loadingCategories, category],
        errors: {
          ...state.errors,
          [category]: undefined,
        },
      }));

      productService.getProducts(category).subscribe({
        next: (products) => {
          patchState(store, (state) => ({
            products: {
              ...state.products,
              [category]: products,
            },
            loadedCategories: [...state.loadedCategories, category],
            loadingCategories: state.loadingCategories.filter((item) => item !== category),
          }));
        },

        error: (error) => {
          patchState(store, (state) => ({
            loadingCategories: state.loadingCategories.filter((item) => item !== category),
            errors: {
              ...state.errors,
              [category]: error.message ?? 'Failed to load products',
            },
          }));
        },
      });
    },
  })),
);

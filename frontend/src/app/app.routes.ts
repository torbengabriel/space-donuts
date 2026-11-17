import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/products/pages/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'stores',
    loadComponent: () => import('./features/stores/pages/stores/stores').then((m) => m.Stores),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/pages/about/about').then((m) => m.About),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/pages/admin/admin').then((m) => m.Admin),
  },
];

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'stores',
    loadComponent: () => import('./pages/stores/stores').then((m) => m.Stores),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
];

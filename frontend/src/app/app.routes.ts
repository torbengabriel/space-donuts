import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about')
        .then((m) => m.AboutComponent),
  },
];

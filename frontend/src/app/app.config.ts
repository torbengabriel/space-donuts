import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/auth/auth.interceptor';
import { CartStore } from './features/cart/store/cart.store';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const cartStore = inject(CartStore);

      const authenticated = await authService.init();

      if (authenticated) {
        await cartStore.loadCart();
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor])),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
  ],
};

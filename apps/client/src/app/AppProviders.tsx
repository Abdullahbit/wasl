/**
 * Composes application-wide providers without coupling them to route components.
 */

import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { store } from '../store';
import { I18nProvider } from '../lib/i18n/I18nProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    </I18nProvider>
  );
}

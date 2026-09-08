/**
 * Declares the application's single route tree and route-level feature boundaries.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { CommunitiesPage } from '../pages/CommunitiesPage';
import { CommunityDetailsPage } from '../pages/CommunityDetailsPage';
import { HomePage } from '../pages/HomePage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { PlanPage } from '../pages/PlanPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { useTranslation } from '../lib/i18n/useTranslation';

function ResourcesPlaceholder() {
  const { t } = useTranslation();
  return <PlaceholderPage title={t('onboarding.placeholders.resourcesTitle')} description={t('onboarding.placeholders.resourcesDescription')} />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'plan', element: <PlanPage /> },
      { path: 'communities', element: <CommunitiesPage /> },
      { path: 'communities/:id', element: <CommunityDetailsPage /> },
      { path: 'resources', element: <ResourcesPlaceholder /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

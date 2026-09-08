/**
 * Declares the application's single route tree and route-level feature boundaries.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { CommunitiesPage } from '../pages/CommunitiesPage';
import { HomePage } from '../pages/HomePage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { useTranslation } from '../lib/i18n/useTranslation';

function PlanPlaceholder() {
  const { t } = useTranslation();
  return <PlaceholderPage title={t('onboarding.placeholders.planTitle')} description={t('onboarding.placeholders.planDescription')} />;
}

function CommunityDetailsPlaceholder() {
  const { t } = useTranslation();
  return <PlaceholderPage title={t('onboarding.placeholders.communityDetailsTitle')} description={t('onboarding.placeholders.communityDetailsDescription')} />;
}

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
      { path: 'plan', element: <PlanPlaceholder /> },
      { path: 'communities', element: <CommunitiesPage /> },
      { path: 'communities/:id', element: <CommunityDetailsPlaceholder /> },
      { path: 'resources', element: <ResourcesPlaceholder /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

/**
 * Declares the application's single route tree and route-level feature boundaries.
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { CommunitiesPage } from '../pages/CommunitiesPage';
import { HomePage } from '../pages/HomePage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'plan',
        element: <PlaceholderPage title="Your roadmap" description="AI-grounded next steps live here." />,
      },
      { path: 'communities', element: <CommunitiesPage /> },
      {
        path: 'communities/:id',
        element: <PlaceholderPage title="Community details" description="Community details live here." />,
      },
      {
        path: 'resources',
        element: <PlaceholderPage title="Resources" description="Curated newcomer guides live here." />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

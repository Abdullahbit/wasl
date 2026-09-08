/**
 * Provides the shared accessible navigation and content frame for public routes.
 */

import { Link, NavLink, Outlet } from 'react-router-dom';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { designTokens } from '../design-system/designTokens';
import { useTranslation } from '../lib/i18n/useTranslation';

export function AppShell() {
  const { t } = useTranslation();

  const navigationItems = [
    { to: '/onboarding', label: t('navigation.onboarding') },
    { to: '/plan', label: t('navigation.roadmap') },
    { to: '/communities', label: t('navigation.communities') },
    { to: '/resources', label: t('navigation.resources') },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-card shadow-soft">
        <div
          className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: designTokens.layout.contentMaxWidth }}
        >
          <Link to="/" className="text-2xl font-bold text-primary">
            {t('common.wasl')}
          </Link>
          <div className="flex items-center gap-4">
            <nav aria-label={t('navigation.main')} className="hidden items-center gap-4 sm:flex">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground')}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
        <nav aria-label={t('navigation.main')} className="flex gap-4 overflow-x-auto border-t px-4 py-2 sm:hidden">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'whitespace-nowrap font-semibold text-primary'
                  : 'whitespace-nowrap text-muted-foreground hover:text-foreground'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main
        className="mx-auto w-full flex-1 px-4 py-8 sm:px-6 lg:px-8"
        style={{ maxWidth: designTokens.layout.contentMaxWidth }}
      >
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Provides the shared accessible navigation and content frame for public routes.
 */

import { Link, NavLink, Outlet } from 'react-router-dom';
import { designTokens } from '../design-system/designTokens';

const navigationItems = [
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/plan', label: 'Roadmap' },
  { to: '/communities', label: 'Communities' },
  { to: '/resources', label: 'Resources' },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b bg-card shadow-soft">
        <div
          className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: designTokens.layout.contentMaxWidth }}
        >
          <Link to="/" className="text-2xl font-bold text-primary">WASL</Link>
          <nav aria-label="Main navigation" className="flex gap-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
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

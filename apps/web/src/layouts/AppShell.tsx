/**
 * Provides the shared accessible navigation and content frame for public routes.
 */

import { Link, NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/plan', label: 'Roadmap' },
  { to: '/communities', label: 'Communities' },
  { to: '/resources', label: 'Resources' },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold text-blue-700">WASL</Link>
          <nav aria-label="Main navigation" className="flex gap-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'font-semibold text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

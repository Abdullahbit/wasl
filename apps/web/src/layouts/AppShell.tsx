/**
 * Provides the shared accessible navigation and content frame for public routes.
 */

import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const navigationItems = [
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/plan', label: 'Starter Plan' },
  { to: '/communities', label: 'Communities' },
  { to: '/resources', label: 'Resources' },
];

export function AppShell() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 pt-[22px] pb-[70px]">
      <header className="flex items-center justify-between mb-[28px]">
        <Link to="/" className="flex items-center gap-2.5 text-[20px] font-extrabold text-foreground">
          <div className="grid h-9 w-9 place-items-center rounded-[13px] rounded-br-[4px] bg-primary text-primary-foreground">
            <ArrowUpRight className="h-5 w-5" strokeWidth={3} />
          </div>
          WASL
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-1.5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full border px-3 py-2 text-sm font-extrabold transition-colors ${
                  isActive
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

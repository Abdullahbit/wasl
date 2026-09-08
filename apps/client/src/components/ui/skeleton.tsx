/**
 * Provides a lightweight skeleton placeholder for loading states.
 *
 * Uses the design-system muted background and pulse animation to avoid
 * layout shifts while data is being fetched.
 */

import { cn } from '@/lib/utils';

export function Skeleton({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="skeleton" className={cn('animate-pulse rounded-md bg-muted', className)} {...properties} />;
}

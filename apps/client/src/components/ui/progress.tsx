/**
 * Provides the themed shadcn/ui progress indicator for multi-step flows.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export function Progress({ className, value = 0, max = 100, ...properties }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...properties}
    >
      <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${percentage}%` }} />
    </div>
  );
}

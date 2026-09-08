/**
 * Provides themed shadcn/ui card primitives for grouped application content.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...properties }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl border bg-card text-card-foreground shadow-card', className)}
      {...properties}
    />
  );
}

export function CardHeader({ className, ...properties }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-header" className={cn('grid gap-1.5 p-6', className)} {...properties} />;
}

export function CardTitle({ className, ...properties }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 data-slot="card-title" className={cn('text-xl font-semibold', className)} {...properties} />;
}

export function CardContent({ className, ...properties }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="card-content" className={cn('p-6 pt-0', className)} {...properties} />;
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Kicker({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-[12px] uppercase tracking-[0.13em] font-extrabold text-primary mb-2.5", className)} {...props}>
      {children}
    </div>
  );
}

export function Lead({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[19px] text-muted-foreground max-w-[690px] m-0", className)} {...props}>
      {children}
    </p>
  );
}

export function Heading1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("text-[clamp(40px,6vw,72px)] leading-[1.0] tracking-[-0.055em] font-extrabold m-0 max-w-[900px]", className)} {...props}>
      {children}
    </h1>
  );
}

export function Heading2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-[34px] leading-[1.1] tracking-[-0.04em] font-extrabold m-0", className)} {...props}>
      {children}
    </h2>
  );
}

export function Heading3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-[20px] tracking-[-0.02em] font-bold m-0", className)} {...props}>
      {children}
    </h3>
  );
}

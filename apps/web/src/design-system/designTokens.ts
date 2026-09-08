/**
 * Exposes product-specific layout and semantic design decisions to client code.
 */

export const designTokens = {
  product: {
    name: 'From Newcomer to Connected',
    theme: 'Istanbul Bridge',
  },
  layout: {
    sidebarWidth: 264,
    contentMaxWidth: 1180,
  },
  radius: {
    sm: 10,
    control: 14,
    card: 20,
    feature: 28,
  },
  spacing: [4, 8, 12, 16, 24, 32, 48, 64],
  recommendationPriority: {
    doFirst: 'destructive',
    connect: 'warning',
    grow: 'success',
  },
} as const;

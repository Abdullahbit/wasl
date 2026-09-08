/**
 * Converts database community records into transport-safe contract values.
 */

import type { Community as DatabaseCommunity } from '@prisma/client';
import type { Community } from '@wasl/contracts';

export function serializeCommunity(community: DatabaseCommunity): Community {
  return {
    ...community,
    lastReviewed: community.lastReviewed?.toISOString() ?? null,
    createdAt: community.createdAt.toISOString(),
    updatedAt: community.updatedAt.toISOString(),
  };
}

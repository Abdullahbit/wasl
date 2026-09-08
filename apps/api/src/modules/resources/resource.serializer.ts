/**
 * Converts database resource records into transport-safe contract values.
 */

import type { Resource as DatabaseResource } from '@prisma/client';
import type { Resource } from '@wasl/contracts';

export function serializeResource(resource: DatabaseResource): Resource {
  return {
    ...resource,
    lastReviewed: resource.lastReviewed?.toISOString() ?? null,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

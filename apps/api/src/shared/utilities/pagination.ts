import { z } from 'zod'

const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export function parsePagination(query: Record<string, unknown>) {
  const result = PaginationQuerySchema.safeParse(query)
  if (!result.success) {
    return { page: 1, limit: 20 }
  }
  const { page, limit } = result.data
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  }
}

export function buildMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  }
}

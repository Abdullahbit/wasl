import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed not yet implemented — see Task 11')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

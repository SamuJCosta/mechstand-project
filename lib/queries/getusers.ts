import { prisma } from "@/lib/prisma"

export async function getUsers({ page = 1, role }: { page?: number; role?: string }) {
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const roleFilter = role && role !== "TODOS" ? { role } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: roleFilter,
      skip,
      take: pageSize,
      orderBy: { id: "asc" },
    }),
    prisma.user.count({
      where: roleFilter,
    }),
  ])

  return {
    users,
    total,
    page,
    pageSize,
  }
}

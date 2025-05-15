import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''

  if (!query) {
    return NextResponse.json([])
  }

  const clientes = await prisma.user.findMany({
    where: {
      role: 'CLIENT',
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 10,
  })

  return NextResponse.json(clientes)
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (
      !decoded ||
      typeof decoded !== 'object' ||
      (decoded.role !== 'MECANICO' && decoded.role !== 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const pecas = await prisma.peca.findMany({
      select: {
        id: true,
        nome: true,
        quantidade: true,
      },
      orderBy: {
        quantidade: 'asc',
      },
    })

    return NextResponse.json(pecas)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar peças' }, { status: 500 })
  }
}

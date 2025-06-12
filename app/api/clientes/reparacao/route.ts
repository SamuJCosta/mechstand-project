// /app/api/clientes/reparacoes/route.ts

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
    if (!decoded || typeof decoded !== 'object') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    if (decoded.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const clienteId = decoded.userId

    const reparacoes = await prisma.reparacao.findMany({
      where: { clienteId },
      include: {
        carro: {
          select: {
            marca: true,
            modelo: true,
            matricula: true,
          },
        },
        mecanico: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ reparacoes })
  } catch (error) {
    console.error('Erro ao buscar reparações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

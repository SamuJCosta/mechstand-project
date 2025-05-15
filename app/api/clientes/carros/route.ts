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
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (decoded.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const clienteId = decoded.userId

    const carros = await prisma.carro.findMany({
      where: { donoId: clienteId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(carros)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar carros' }, { status: 500 })
  }
}

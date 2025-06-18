// /app/api/clientes/mecanicos/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const decoded = verifyAccessToken(token)
    if (!decoded || typeof decoded !== 'object' || decoded.role !== 'CLIENT') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const mecanicos = await prisma.user.findMany({
      where: { role: 'MECANICO' },
      select: {
        id: true,
        name: true,
        _count: {
          select: { avaliacoesRecebidas: true },
        },
        avaliacoesRecebidas: {
          select: {
            nota: true,
          },
        },
      },
    })

    const data = mecanicos.map((m) => {
      const total = m.avaliacoesRecebidas.length
      const media =
        total > 0
          ? m.avaliacoesRecebidas.reduce((sum, a) => sum + a.nota, 0) / total
          : null
      return {
        id: m.id,
        name: m.name,
        media: media ? Number(media.toFixed(1)) : null,
        totalAvaliacoes: total,
      }
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao buscar mecânicos' }, { status: 500 })
  }
}

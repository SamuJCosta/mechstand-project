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

    if (!decoded || typeof decoded !== 'object' || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const [totalVendas, totalAnuncios, totalUsers, ultimasVendas] = await Promise.all([
      prisma.venda.count(),
      prisma.anuncio.count(),
      prisma.user.count(),
      prisma.venda.findMany({
        take: 5,
        orderBy: { data: 'desc' },
        include: {
          anuncio: {
            include: { carro: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      totalVendas,
      totalAnuncios,
      totalUsers,
      ultimasVendas,
    })
  } catch (err) {
    console.error('Erro ao buscar dashboard do admin:', err)
    return NextResponse.json({ error: 'Erro ao buscar dashboard' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const anuncios = await prisma.anuncio.findMany({
      where: { status: 'disponivel' },
      include: {
        carro: true,
        imagens: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(anuncios)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar anúncios' }, { status: 500 })
  }
}

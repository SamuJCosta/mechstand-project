import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)
    if (!decoded || typeof decoded !== 'object' || (decoded.role !== 'MECANICO' && decoded.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID do anúncio não fornecido.' }, { status: 400 })
    }

    // Apaga as imagens relacionadas primeiro para evitar erros de integridade
    await prisma.carroImagem.deleteMany({
      where: { anuncioId: id },
    })

    // Apaga o anúncio
    await prisma.anuncio.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Anúncio removido com sucesso!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao remover anúncio.' }, { status: 500 })
  }
}

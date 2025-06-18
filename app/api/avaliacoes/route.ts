import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function POST(req: Request) {
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
      decoded.role !== 'CLIENT'
    ) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { nota, comentario, reparacaoId, mecanicoId } = await req.json()

    // Validação simples
    if (
      nota == null ||
      reparacaoId == null ||
      mecanicoId == null
    ) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    // Verificar se já existe avaliação para esta reparação
    const jaExiste = await prisma.avaliacao.findUnique({
      where: { reparacaoId },
    })

    if (jaExiste) {
      return NextResponse.json({ error: 'Esta reparação já foi avaliada.' }, { status: 400 })
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        nota,
        comentario: comentario || null,
        clienteId: decoded.userId,
        mecanicoId,
        reparacaoId,
      },
    })

    return NextResponse.json({ message: 'Avaliação registada com sucesso!', avaliacao })
  } catch (err) {
    console.error('Erro ao criar avaliação:', err)
    return NextResponse.json({ error: 'Erro ao criar avaliação.' }, { status: 500 })
  }
}

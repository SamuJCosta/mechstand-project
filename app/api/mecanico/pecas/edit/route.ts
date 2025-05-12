import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== 'object' || decoded.role !== 'MECANICO') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { id, nome, descricao, quantidade, preco } = await req.json()

    if (!id || !nome || preco == null || quantidade == null) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    const pecaAtualizada = await prisma.peca.update({
      where: { id },
      data: {
        nome,
        descricao,
        quantidade,
        preco,
      },
    })

    return NextResponse.json({ message: 'Peça atualizada com sucesso!', peca: pecaAtualizada })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao atualizar peça' }, { status: 500 })
  }
}

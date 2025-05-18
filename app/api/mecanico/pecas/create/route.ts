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

    const isMecanicoOuAdmin =
      decoded &&
      typeof decoded === 'object' &&
      (decoded.role === 'MECANICO' || decoded.role === 'ADMIN')

    if (!isMecanicoOuAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { nome, descricao, quantidade, preco } = await req.json()

    if (!nome || preco == null || quantidade == null) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    const novaPeca = await prisma.peca.create({
      data: {
        nome,
        descricao,
        quantidade,
        preco,
        criadoPorId: decoded.userId,
      },
    })

    return NextResponse.json({ message: 'Peça criada com sucesso!', peca: novaPeca })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar peça' }, { status: 500 })
  }
}

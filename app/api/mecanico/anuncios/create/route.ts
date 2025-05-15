import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== 'object' || (decoded.role !== 'MECANICO' && decoded.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { titulo, descricao, preco, carroId, imagens } = await req.json()

    if (!titulo || !preco || !carroId || !imagens || !Array.isArray(imagens) || imagens.length === 0) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    // Verifica se o carro existe e pertence a alguém
    const carro = await prisma.carro.findUnique({ where: { id: carroId } })
    if (!carro) {
      return NextResponse.json({ error: 'Carro não encontrado.' }, { status: 404 })
    }

    // Cria o anúncio e as imagens associadas
    const novoAnuncio = await prisma.anuncio.create({
      data: {
        titulo,
        descricao,
        preco,
        carroId,
        criadoPorId: decoded.userId,
        imagens: {
          create: imagens.map((url: string) => ({ url })),
        },
      },
      include: { imagens: true, carro: true },
    })

    return NextResponse.json({ message: 'Anúncio criado com sucesso!', anuncio: novoAnuncio })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar anúncio' }, { status: 500 })
  }
}

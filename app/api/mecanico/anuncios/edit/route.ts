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
    if (!decoded || typeof decoded !== 'object' || (decoded.role !== 'MECANICO' && decoded.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { id, titulo, descricao, preco, status, imagens } = await req.json()

    if (!id || !titulo || !preco || !status || !Array.isArray(imagens)) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta ou inválidos.' }, { status: 400 })
    }

    // Atualiza anúncio e sincroniza imagens:
    // Remove imagens que não estão na lista nova
    // Adiciona imagens novas (base64 ou URLs que ainda não existem no DB)

    const anuncioExistente = await prisma.anuncio.findUnique({
      where: { id },
      include: { imagens: true },
    })

    if (!anuncioExistente) {
      return NextResponse.json({ error: 'Anúncio não encontrado.' }, { status: 404 })
    }

    // Deleta imagens removidas
    const imagensParaDeletar = anuncioExistente.imagens.filter(
      (img) => !imagens.includes(img.url)
    )
    await prisma.carroImagem.deleteMany({
      where: {
        id: { in: imagensParaDeletar.map((img) => img.id) },
      },
    })

    // Identifica imagens novas para adicionar (não estão no DB)
    const imagensExistentesUrls = anuncioExistente.imagens.map((img) => img.url)
    const imagensNovas = imagens.filter((img) => !imagensExistentesUrls.includes(img))

    // Adiciona imagens novas
    for (const url of imagensNovas) {
      await prisma.carroImagem.create({
        data: {
          url,
          anuncioId: id,
        },
      })
    }

    // Atualiza dados do anúncio
    const anuncioAtualizado = await prisma.anuncio.update({
      where: { id },
      data: {
        titulo,
        descricao,
        preco,
        status,
      },
    })

    return NextResponse.json({ message: 'Anúncio atualizado com sucesso', anuncio: anuncioAtualizado })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar anúncio' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { anuncioId } = await req.json()

  if (!anuncioId) {
    return new Response(JSON.stringify({ error: 'ID não fornecido' }), { status: 400 })
  }

  try {
    const anuncio = await prisma.anuncio.findUnique({
      where: { id: parseInt(anuncioId) },
    })

    if (!anuncio) {
      return new Response(JSON.stringify({ error: 'Anúncio não encontrado' }), { status: 404 })
    }

    // Marca como vendido
    await prisma.anuncio.update({
      where: { id: anuncio.id },
      data: { status: 'vendido' },
    })

    // Grava a venda
    await prisma.venda.create({
      data: {
        anuncioId: anuncio.id,
        valor: anuncio.preco,
      },
    })

    return new Response(JSON.stringify({ message: 'Anúncio vendido e registrado' }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Erro ao concluir venda' }), { status: 500 })
  }
}

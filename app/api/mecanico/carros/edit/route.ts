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

    const isMecanicoOuAdmin =
      decoded &&
      typeof decoded === 'object' &&
      (decoded.role === 'MECANICO' || decoded.role === 'ADMIN')

    if (!isMecanicoOuAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const {
      id,
      matricula,
      marca,
      modelo,
      ano,
      tipoCombustivel,
      potencia,
      cilindrada,
      quilometragem,
      donoId,
      imagemUrl,
    } = await req.json()

    if (
      !id ||
      !matricula ||
      !marca ||
      !modelo ||
      !ano ||
      !tipoCombustivel ||
      potencia == null ||
      quilometragem == null
    ) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    // Verifica se o carro existe
    const carroExistente = await prisma.carro.findUnique({
      where: { id },
    })

    if (!carroExistente) {
      return NextResponse.json({ error: 'Carro não encontrado.' }, { status: 404 })
    }

    // Opcional: verifica se a matrícula está a ser alterada para uma já existente noutro carro
    if (matricula !== carroExistente.matricula) {
      const carroComMesmaMatricula = await prisma.carro.findUnique({
        where: { matricula },
      })
      if (carroComMesmaMatricula) {
        return NextResponse.json({ error: 'Outra matrícula igual já existe.' }, { status: 400 })
      }
    }

    const carroAtualizado = await prisma.carro.update({
      where: { id },
      data: {
        matricula,
        marca,
        modelo,
        ano,
        tipoCombustivel,
        potencia,
        cilindrada,
        quilometragem,
        donoId: donoId ?? null,
        imagemUrl: imagemUrl ?? null,
      },
    })

    return NextResponse.json({ message: 'Carro atualizado com sucesso!', carro: carroAtualizado })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao atualizar o carro' }, { status: 500 })
  }
}

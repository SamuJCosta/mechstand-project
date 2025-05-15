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

    const {
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

    // Verifica se já existe carro com a matrícula
    const carroExistente = await prisma.carro.findUnique({
      where: { matricula },
    })

    if (carroExistente) {
      return NextResponse.json({ error: 'Veículo já registado.' }, { status: 400 })
    }

    const novoCarro = await prisma.carro.create({
      data: {
        matricula,
        marca,
        modelo,
        ano,
        tipoCombustivel,
        potencia,
        cilindrada,
        quilometragem,
        imagemUrl: imagemUrl ?? null,
        donoId: donoId ?? null,
      },
    })

    return NextResponse.json({ message: 'Carro criado com sucesso!', carro: novoCarro })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao criar carro' }, { status: 500 })
  }
}

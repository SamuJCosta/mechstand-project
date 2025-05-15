import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(req: Request) {
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
      (decoded.role !== 'MECANICO' && decoded.role !== 'ADMIN')
    ) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Pega os carros onde o donoId é o id do mecânico (ou admin pode ver todos, por exemplo)
    // Ajusta essa lógica conforme necessário
    const carros = await prisma.carro.findMany({
      where: {
        // Se admin, pega todos, se mecanico, pega só carros que ele criou — ajustar se tiver campo criador
        // Por enquanto só filtra por donoId == null (stand) ou não, porque não há criador nos carros
        // Se quiseres, permite que mecânico veja todos carros no stand (donoId null) ou dos clientes dele
        // Aqui vou retornar todos carros para admin, e para mecânico só os carros com donoId != null
        OR: decoded.role === 'ADMIN'
          ? undefined
          : [
              { donoId: { not: null } }, // carros com dono
              { donoId: null }, // carros do stand (se quiser incluir)
            ],
      },
      orderBy: { createdAt: 'desc' },
      include: { dono: true },
    })

    return NextResponse.json(carros)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar carros' }, { status: 500 })
  }
}

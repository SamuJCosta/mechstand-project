import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.role !== "CLIENT") {
      return NextResponse.json({ error: "Apenas clientes podem agendar reparações." }, { status: 403 })
    }

    const body = await req.json()

    const {
      titulo,
      descricao,
      dataDesejada,
      carroId,
      mecanicoId: rawMecanicoId,
    } = body

    if (!titulo || !dataDesejada) {
      return NextResponse.json({ error: "Título e data desejada são obrigatórios." }, { status: 400 })
    }

    const mecanicoId = rawMecanicoId && !isNaN(Number(rawMecanicoId))
      ? parseInt(rawMecanicoId)
      : null

    if (carroId) {
      const carro = await prisma.carro.findUnique({ where: { id: carroId } })
      if (!carro) {
        return NextResponse.json({ error: "Carro não encontrado." }, { status: 404 })
      }
    }

    const novaReparacao = await prisma.reparacao.create({
      data: {
        titulo,
        descricao,
        dataDesejada: new Date(dataDesejada),
        clienteId: decoded.userId,
        carroId: carroId || null,
        mecanicoId: mecanicoId,
      },
    })

    if (mecanicoId) {
      await prisma.notificacao.create({
        data: {
          userId: mecanicoId,
          mensagem: `Nova reparação atribuída: ${titulo}`,
        },
      })
    } else {
      const mecanicos = await prisma.user.findMany({
        where: { role: "MECANICO" },
      })

      await prisma.notificacao.createMany({
        data: mecanicos.map((m) => ({
          userId: m.id,
          mensagem: `Nova reparação pendente: ${titulo}`,
        })),
      })
    }

    return NextResponse.json({
      message: "Reparação agendada com sucesso!",
      reparacao: novaReparacao,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao criar reparação" }, { status: 500 })
  }
}

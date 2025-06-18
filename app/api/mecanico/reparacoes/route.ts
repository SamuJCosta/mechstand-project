import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.role !== "MECANICO") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const pendentes = await prisma.reparacao.findMany({
      where: {
        estado: "PENDENTE",
        OR: [
          { mecanicoId: null },
          { mecanicoId: decoded.userId },
        ],
      },
      include: {
        cliente: true,
        carro: true,
      },
    })

    const minhasReparacoes = await prisma.reparacao.findMany({
      where: {
        mecanicoId: decoded.userId,
        estado: {
          in: ["ACEITE", "REAGENDAR", "CONCLUIDA"],
        },
      },
      include: {
        cliente: true,
        carro: true,
      },
    })

    return NextResponse.json({ pendentes, minhasReparacoes })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao buscar reparações" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    const isCliente =
      decoded &&
      typeof decoded === "object" &&
      decoded.role === "CLIENT"

    if (!isCliente) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const reparacoes = await prisma.reparacao.findMany({
      where: {
        clienteId: decoded.userId,
        estado: "CONCLUIDA",
        avaliacao: null,
      },
      include: {
        mecanico: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(reparacoes)
  } catch (err) {
    console.error("Erro ao buscar reparações para avaliar:", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

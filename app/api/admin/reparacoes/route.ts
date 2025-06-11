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

    const decoded = verifyAccessToken(token) as { role: string }

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const reparacoes = await prisma.reparacao.findMany({
      include: {
        cliente: true,
        mecanico: true,
        carro: true,
      },
      orderBy: {
        dataDesejada: "desc",
      },
    })

    return NextResponse.json(reparacoes)
  } catch (err) {
    console.error("Erro ao buscar reparações:", err)
    return NextResponse.json({ error: "Erro ao buscar reparações" }, { status: 500 })
  }
}

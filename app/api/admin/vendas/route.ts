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

    if (!decoded || typeof decoded !== "object" || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const vendas = await prisma.venda.findMany({
      include: {
        anuncio: {
          include: {
            carro: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    })

    return NextResponse.json(vendas)
  } catch (err) {
    console.error("Erro ao buscar vendas:", err)
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

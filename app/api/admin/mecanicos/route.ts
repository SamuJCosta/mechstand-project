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

    const mecanicos = await prisma.user.findMany({
      where: { role: "MECANICO" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(mecanicos)
  } catch (err) {
    console.error("Erro ao buscar mecânicos:", err)
    return NextResponse.json({ error: "Erro ao buscar mecânicos" }, { status: 500 })
  }
}

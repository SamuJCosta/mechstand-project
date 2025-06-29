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

    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    })

    return NextResponse.json(users)
  } catch (err) {
    console.error("Erro ao buscar utilizadores:", err)
    return NextResponse.json({ error: "Erro ao buscar utilizadores" }, { status: 500 })
  }
}

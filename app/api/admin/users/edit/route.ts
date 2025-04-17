import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function PUT(req: Request) {
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

    const { id, name, email, username, role } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        username,
        role,
      },
    })

    return NextResponse.json({ message: "Utilizador atualizado", user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar utilizador" }, { status: 500 })
  }
}
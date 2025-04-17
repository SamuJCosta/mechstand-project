import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function DELETE(req: Request) {
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

    const { id } = await req.json()

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Utilizador removido com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover utilizador" }, { status: 500 })
  }
}

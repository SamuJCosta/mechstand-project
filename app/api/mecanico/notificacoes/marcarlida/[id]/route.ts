import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 })
    }

    const notificacaoId = parseInt(params.id)

    const notificacao = await prisma.notificacao.findUnique({
      where: { id: notificacaoId },
    })

    if (!notificacao || notificacao.userId !== decoded.userId) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 })
    }

    await prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { lida: true },
    })

    return NextResponse.json({ message: "Notificação marcada como lida" })
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

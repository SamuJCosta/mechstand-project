import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const decoded = verifyAccessToken(token)
    if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
      return NextResponse.json({ error: "Token inválido" }, { status: 403 })

    const id = req.nextUrl.pathname.split("/").pop()
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    await prisma.notificacao.delete({
      where: {
        id: parseInt(id),
        userId: decoded.userId,
      },
    })

    return NextResponse.json({ message: "Notificação removida" })
  } catch (err) {
    return NextResponse.json({ error: "Erro ao remover notificação" }, { status: 500 })
  }
}

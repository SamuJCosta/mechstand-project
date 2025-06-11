import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const id = parseInt(params.id)
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const { mecanicoId } = await req.json()

    const reparacao = await prisma.reparacao.update({
      where: { id },
      data: { mecanicoId },
      include: {
        cliente: true,
        mecanico: true,
      },
    })

    return NextResponse.json({ message: "Mecânico atribuído com sucesso", reparacao })
  } catch (err) {
    console.error("Erro ao atribuir mecânico:", err)
    return NextResponse.json({ error: "Erro ao atribuir mecânico" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"
import {
  sendReparacaoReagendadaEmail,
  sendReparacaoConcluidaEmail,
} from "@/lib/reagendarmail"

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("role" in decoded) ||
      decoded.role !== "MECANICO"
    ) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const url = new URL(req.url)
    const idStr = url.pathname.split("/").pop()
    const reparacaoId = parseInt(idStr || "", 10)
    if (isNaN(reparacaoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const { estado, novaData } = await req.json()
    if (!estado) {
      return NextResponse.json({ error: "Estado é obrigatório" }, { status: 400 })
    }

    const reparacao = await prisma.reparacao.findUnique({
      where: { id: reparacaoId },
      include: { cliente: true },
    })

    if (!reparacao) {
      return NextResponse.json({ error: "Reparação não encontrada" }, { status: 404 })
    }

    if (
      estado === "ACEITE" &&
      reparacao.mecanicoId &&
      reparacao.mecanicoId !== decoded.userId
    ) {
      return NextResponse.json(
        { error: "Reparação já atribuída a outro mecânico" },
        { status: 400 }
      )
    }

    const dataUpdate: any = { estado }

    if (estado === "ACEITE") {
      dataUpdate.mecanicoId = decoded.userId
      dataUpdate.dataConfirmada = new Date(reparacao.dataDesejada)
    }

    if (estado === "REAGENDAR") {
      if (!novaData) {
        return NextResponse.json(
          { error: "Nova data é obrigatória para reagendamento" },
          { status: 400 }
        )
      }
      dataUpdate.dataConfirmada = new Date(novaData)
    }

    if (estado === "CONCLUIDA") {
      dataUpdate.updatedAt = new Date()
    }

    const updated = await prisma.reparacao.update({
      where: { id: reparacaoId },
      data: dataUpdate,
    })

    if (reparacao.cliente?.email && reparacao.cliente?.name) {
      if (estado === "REAGENDAR") {
        await sendReparacaoReagendadaEmail({
          to: reparacao.cliente.email,
          username: reparacao.cliente.name,
          novaData,
          titulo: reparacao.titulo,
        })
      }

      if (estado === "CONCLUIDA") {
        await sendReparacaoConcluidaEmail({
          to: reparacao.cliente.email,
          username: reparacao.cliente.name,
          titulo: reparacao.titulo,
        })
      }
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Erro ao atualizar reparação:", err)
    return NextResponse.json(
      { error: "Erro ao atualizar reparação" },
      { status: 500 }
    )
  }
}

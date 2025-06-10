// /api/cliente/carros/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]

    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded !== "object" || decoded.role !== "CLIENT") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const carros = await prisma.carro.findMany({
      where: { donoId: decoded.userId },
      select: {
        id: true,
        marca: true,
        modelo: true,
        matricula: true,
      },
    })

    return NextResponse.json({ carros })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao obter veículos" }, { status: 500 })
  }
}

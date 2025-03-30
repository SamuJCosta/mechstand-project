import { verifyAccessToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const decoded = verifyAccessToken(token)
  if (!decoded || decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
  }

  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken, generateAccessToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json()
    const decoded = verifyToken(refreshToken, "refresh") as { userId: number }
    

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 403 })
    }

    const newAccessToken = generateAccessToken(user.id, user.role)

    return NextResponse.json({ accessToken: newAccessToken })
  } catch (err) {
    return NextResponse.json({ error: "Erro ao renovar token" }, { status: 500 })
  }
}

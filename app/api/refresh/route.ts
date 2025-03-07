import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    // Verificar se o refresh token é válido
    const decoded = verifyToken(refreshToken, "refresh");
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido!" }, { status: 403 });
    }

    // Procurar o utilizador na base de dados
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId, refreshToken },
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido ou expirado!" }, { status: 403 });
    }

    // Gerar um novo token de acesso
    const newAccessToken = generateAccessToken(user.id, user.role);

    return NextResponse.json({ accessToken: newAccessToken });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao renovar o token!" }, { status: 500 });
  }
}

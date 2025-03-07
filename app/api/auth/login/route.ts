import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    // Procurar utilizador pelo email ou username
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilizador não encontrado!" }, { status: 404 });
    }

    // Verificar senha
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Credenciais inválidas!" }, { status: 401 });
    }

    // Gerar tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Guardar o refresh token na base de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return NextResponse.json({ accessToken, refreshToken, role: user.role, message: "Login bem-sucedido!" });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao fazer login!" }, { status: 500 });
  }
}

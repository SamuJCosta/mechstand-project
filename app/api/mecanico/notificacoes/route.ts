import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const decoded = verifyAccessToken(token);

    if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
      return NextResponse.json({ error: "Token inválido" }, { status: 403 });
    }

    const notificacoes = await prisma.notificacao.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ notificacoes });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao obter notificações" },
      { status: 500 }
    );
  }
}

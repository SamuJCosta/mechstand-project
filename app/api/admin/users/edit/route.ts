import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded || typeof decoded !== "object" || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id, name, username, email, role } = await req.json();

    if (!id || !name || !username || !email || !role) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
    }

    // Verifica se o novo email ou username já estão em uso por outro utilizador
    const conflictUser = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { email: email },
              { username: username },
            ],
          },
          {
            NOT: { id: id },
          },
        ],
      },
    });

    if (conflictUser) {
      return NextResponse.json({ error: "Email ou username já em uso por outro utilizador" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        email,
        role,
      },
    });

    return NextResponse.json({ message: "Utilizador atualizado com sucesso", user: updatedUser });
  } catch (err) {
    console.error("Erro ao atualizar utilizador:", err);
    return NextResponse.json({ error: "Erro ao atualizar utilizador" }, { status: 500 });
  }
}

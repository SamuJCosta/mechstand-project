import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    // Verificar se o email ou username já existem
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email ou Username já estão registados!" }, { status: 400 });
    }

    // Criar hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar utilizador como CLIENT
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    return NextResponse.json({ message: "Cliente registado com sucesso!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao registar cliente!" }, { status: 500 });
  }
}

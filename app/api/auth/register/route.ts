import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

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
        profileImage: "/userimage.png",
      },
    });

    return NextResponse.json({ message: "Cliente registado com sucesso!" }, { status: 201 });

  } catch (error) {
    console.error("Erro no registo:", error)
    return NextResponse.json(
      { error: "Erro ao registar cliente!", details: (error as Error).message },
      { status: 500 }
    );
  }
  
}

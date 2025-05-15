import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { verifyAccessToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/sendwelcomeemail";

export async function POST(req: Request) {
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

    const { username, email, password, role } = await req.json();

    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (exists) {
      return NextResponse.json({ error: "Email ou username já em uso" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        name: username,
      },
    });

    if (role === "MECANICO") {
      try {
        await sendWelcomeEmail(email, username, role, password);
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        // Poderias decidir se queres falhar a criação do user ou ignorar erro de email
      }
    }

    return NextResponse.json({ message: "Utilizador criado com sucesso!", user });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar utilizador" }, { status: 500 });
  }
}

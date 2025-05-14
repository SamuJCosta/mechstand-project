import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "@/lib/nodemailer";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Procurar user pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Se o email existir, enviamos o link de recuperação." },
        { status: 200 }
      );
    }

    // Gerar token JWT para reset, válido 1h
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Enviar email
    await sendResetEmail(email, token);

    return NextResponse.json({ message: "Email de recuperação enviado!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao enviar email de recuperação." },
      { status: 500 }
    );
  }
}

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecret-access";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "supersecret-refresh";
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// Função para encriptar senhas
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// Gerar Token de Acesso (Expira em 60s)
export function generateAccessToken(userId: number, role: string) {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "60s" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET)
  } catch {
    return null
  }
}

// Gerar Refresh Token (Expira em 7 dias)
export function generateRefreshToken(userId: number) {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
}

// Verificar Token JWT
export function verifyToken(token: string, type: "access" | "refresh") {
  try {
    const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

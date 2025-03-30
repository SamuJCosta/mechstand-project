import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const decoded = verifyAccessToken(token)
  if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { name: true, email: true, profileImage: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}

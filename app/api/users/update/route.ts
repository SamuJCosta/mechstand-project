import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyAccessToken(token) as { userId: number; role: string }

    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !decoded.userId ||
      !['ADMIN', 'CLIENT', 'MECANICO'].includes(decoded.role?.toUpperCase())
    ) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { name, profileImage } = await req.json()

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        profileImage,
      },
    })

    return NextResponse.json({ message: 'Perfil atualizado com sucesso.' })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil.' },
      { status: 500 }
    )
  }
}

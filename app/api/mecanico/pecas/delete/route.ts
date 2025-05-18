import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyAccessToken(token)

    const isMecanicoOuAdmin =
      decoded &&
      typeof decoded === 'object' &&
      (decoded.role === 'MECANICO' || decoded.role === 'ADMIN')

    if (!isMecanicoOuAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 })
    }

    await prisma.peca.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Peça removida com sucesso!' })
  } catch (err) {
    console.error('Erro ao remover peça:', err)
    return NextResponse.json({ error: 'Erro ao remover peça' }, { status: 500 })
  }
}

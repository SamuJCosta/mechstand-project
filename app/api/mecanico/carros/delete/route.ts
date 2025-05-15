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

    // Verifica se o carro existe
    const carroExistente = await prisma.carro.findUnique({
      where: { id },
    })

    if (!carroExistente) {
      return NextResponse.json({ error: 'Carro não encontrado.' }, { status: 404 })
    }

    // Apaga o carro
    await prisma.carro.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Carro removido com sucesso!' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao remover o carro' }, { status: 500 })
  }
}

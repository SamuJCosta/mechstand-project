import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/table'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/card'

export default async function VendasList({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams?.page || 1)
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [vendas, total] = await Promise.all([
    prisma.venda.findMany({
      skip,
      take: pageSize,
      orderBy: { data: 'desc' },
      include: {
        anuncio: {
          include: {
            carro: true,
          },
        },
      },
    }),
    prisma.venda.count(),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.anuncio.titulo}</TableCell>
                <TableCell>{venda.anuncio.carro.marca}</TableCell>
                <TableCell>{venda.anuncio.carro.modelo}</TableCell>
                <TableCell>
                  €{venda.valor.toFixed(2).replace('.', ',')}
                </TableCell>
                <TableCell>
                  {new Date(venda.data).toLocaleDateString('pt-PT')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>
            A mostrar {skip + 1}-{Math.min(skip + pageSize, total)} de {total} vendas
          </span>
          <div className="flex gap-2">
            <a
              className={`px-3 py-1 border rounded ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
              href={`?page=${page - 1}`}
            >
              Anterior
            </a>
            <a
              className={`px-3 py-1 border rounded ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              href={`?page=${page + 1}`}
            >
              Próximo
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

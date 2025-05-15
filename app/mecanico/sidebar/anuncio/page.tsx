import { prisma } from '@/lib/prisma'
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
import { Badge } from '@/components/domains/shared/ui/badge'
import { AnuncioActions } from '@/components/domains/mecanico/anuncio/anuncioactions'
import { AnuncioRowActions } from '@/components/domains/mecanico/anuncio/anunciorowactions'

const statusVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  disponivel: 'default',
  reservado: 'secondary',
  vendido: 'destructive',
}

export default async function AnunciosList() {
  const anuncios = await prisma.anuncio.findMany({
    include: {
      carro: true,
      criadoPor: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <div className="flex justify-between items-center px-6 mt-6 mb-4 flex-wrap gap-4">
        <AnuncioActions />
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Gestão de Anúncios</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Carro</TableHead>
                <TableHead>Preço (€)</TableHead>
                <TableHead>Criado Por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anuncios.map((anuncio) => (
                <TableRow key={anuncio.id}>
                  <TableCell>{anuncio.titulo}</TableCell>
                  <TableCell>
                    {anuncio.carro
                      ? `${anuncio.carro.marca} ${anuncio.carro.modelo} (${anuncio.carro.matricula})`
                      : '-'}
                  </TableCell>
                  <TableCell>{anuncio.preco.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={anuncio.criadoPor.role === 'ADMIN' ? 'default' : 'secondary'}
                    >
                      {anuncio.criadoPor.role}
                    </Badge>{' '}
                    {anuncio.criadoPor.name}
                  </TableCell>
                  <TableCell>
                    {new Date(anuncio.createdAt).toLocaleDateString('pt-PT')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[anuncio.status] ?? 'default'}>
                      {anuncio.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <AnuncioRowActions anuncio={anuncio} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

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
import { PecaActions } from '@/components/domains/mecanico/pecas/pecasactions'
import { PecaRowActions } from '@/components/domains/mecanico/pecas/pecarowactions'

export default async function PecasList() {
  const pecas = await prisma.peca.findMany({
    include: {
      criadoPor: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <div className="flex justify-between items-center px-6 mt-6 mb-4 flex-wrap gap-4">
        <PecaActions />
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Stock de Peças</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pecas.map((peca) => (
                <TableRow key={peca.id}>
                  <TableCell>{peca.nome}</TableCell>
                  <TableCell>{peca.descricao || '-'}</TableCell>
                  <TableCell>{peca.quantidade}</TableCell>
                  <TableCell>{peca.preco.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge variant={peca.criadoPor.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {peca.criadoPor.role}
                    </Badge>{' '}
                    {peca.criadoPor.name}
                  </TableCell>
                  <TableCell>{new Date(peca.createdAt).toLocaleDateString('pt-PT')}</TableCell>
                  <TableCell>
                    <PecaRowActions peca={peca} />
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

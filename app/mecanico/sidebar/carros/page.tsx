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
import { CarroActions } from '@/components/domains/mecanico/carros/carroactions'
import { CarroRowActions } from '@/components/domains/mecanico/carros/carrorowactions'

export default async function CarrosList() {
  const carros = await prisma.carro.findMany({
    include: {
      dono: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <div className="flex justify-between items-center px-6 mt-6 mb-4 flex-wrap gap-4">
        <CarroActions />
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Gestão de Carros</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carros.map((carro) => (
                <TableRow key={carro.id}>
                  <TableCell>{carro.matricula}</TableCell>
                  <TableCell>{carro.marca}</TableCell>
                  <TableCell>{carro.modelo}</TableCell>
                  <TableCell>{carro.ano}</TableCell>
                  <TableCell>
                    {carro.dono ? (
                      <>
                        <Badge variant="secondary">{carro.dono.role}</Badge>{' '}
                        {carro.dono.name}
                      </>
                    ) : (
                      <Badge variant="outline">Stand</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(carro.createdAt).toLocaleDateString('pt-PT')}
                  </TableCell>
                  <TableCell>
                    <CarroRowActions carro={carro} />
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

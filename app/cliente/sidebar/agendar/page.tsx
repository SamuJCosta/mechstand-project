'use client'

import { useEffect, useState } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { Badge } from '@/components/domains/shared/ui/badge'
import { ReparacaoActions } from '@/components/domains/cliente/agendar/reparacaoactions'

interface Reparacao {
  id: number
  titulo: string
  estado: string
  dataDesejada: string
  carro: { marca: string; modelo: string; matricula: string } | null
  mecanico: { name: string } | null
}

export default function ReparacoesPage() {
  const [reparacoes, setReparacoes] = useState<Reparacao[]>([])

  const fetchReparacoes = async () => {
    try {
      const res = await fetch('/api/clientes/reparacao', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      const data = await res.json()
      if (res.ok) {
        setReparacoes(data.reparacoes)
      } else {
        console.error(data.error)
      }
    } catch (err) {
      console.error('Erro ao buscar reparações:', err)
    }
  }

  useEffect(() => {
    fetchReparacoes()
  }, [])

  return (
    <>
      <div className="flex justify-between items-center px-6 mt-6 mb-4 flex-wrap gap-4">
        <ReparacaoActions onSuccess={fetchReparacoes} />
      </div>

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Histórico de Reparações</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Data Desejada</TableHead>
                <TableHead>Mecânico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reparacoes.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>{rep.titulo}</TableCell>
                  <TableCell>
                    {rep.carro
                      ? `${rep.carro.marca} ${rep.carro.modelo} (${rep.carro.matricula})`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge>{rep.estado}</Badge>
                  </TableCell>
                  <TableCell>{new Date(rep.dataDesejada).toLocaleString('pt-PT')}</TableCell>
                  <TableCell>{rep.mecanico?.name || 'Por atribuir'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

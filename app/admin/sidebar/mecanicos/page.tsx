"use client"

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card'
import { Button } from '@/components/domains/shared/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import AtribuirMecanicoModal from '@/components/domains/admin/reparacoes/atribuirmecanicomodal'

export default function AdminReparacoesPage() {
  const [reparacoes, setReparacoes] = useState([])
  const [mecanicos, setMecanicos] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<any>(null)
  const [mecanicoId, setMecanicoId] = useState<string>('')

  const fetchData = async () => {
    const [repRes, mecRes] = await Promise.all([
      fetch('/api/admin/reparacoes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }),
      fetch('/api/admin/mecanicos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }),
    ])

    const repData = await repRes.json()
    const mecData = await mecRes.json()
    setReparacoes(repData)
    setMecanicos(mecData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const atribuirMecanico = async () => {
    if (!detalhesSelecionados || !mecanicoId) return

    await fetch(`/api/admin/reparacoes/${detalhesSelecionados.id}/atribuir`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ mecanicoId: parseInt(mecanicoId) }),
    })

    setModalAberto(false)
    fetchData()
  }

  const estadoCores = {
    PENDENTE: '#9CA3AF',
    ACEITE: '#3B82F6',
    REAGENDAR: '#F59E0B',
    CONCLUIDA: '#10B981',
    RECUSADA: '#EF4444',
  }

  const estatisticas = reparacoes.reduce((acc: any, r: any) => {
    acc[r.estado] = (acc[r.estado] || 0) + 1
    return acc
  }, {})

  const graficoData = Object.entries(estatisticas).map(([estado, total]) => ({
    estado,
    total,
  }))

  return (
    <div className="w-full p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Todas as Reparações</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            locale={ptLocale}
            events={reparacoes.map((r: any) => ({
              id: r.id,
              title: `${r.titulo}${r.descricao ? ` - ${r.descricao}` : ''}`,
              start: r.dataConfirmada || r.dataDesejada,
              color: estadoCores[r.estado as keyof typeof estadoCores] || "gray",
              extendedProps: r,
            }))}
            eventClick={(info) => {
              setDetalhesSelecionados(info.event.extendedProps)
              setModalAberto(true)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Reparações por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graficoData}>
              <XAxis dataKey="estado" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total">
                {graficoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={estadoCores[entry.estado as keyof typeof estadoCores] || "#9CA3AF"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <AtribuirMecanicoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        detalhes={detalhesSelecionados}
        mecanicos={mecanicos}
        mecanicoId={mecanicoId}
        setMecanicoId={setMecanicoId}
        atribuirMecanico={atribuirMecanico}
      />
    </div>
  )
}

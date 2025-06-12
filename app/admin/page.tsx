'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptLocale from '@fullcalendar/core/locales/pt'
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

interface Venda {
  id: number
  titulo: string
  valor: number
  data: string
}

interface Reparacao {
  id: number
  titulo: string
  descricao?: string
  estado: string
  dataDesejada: string
  dataConfirmada?: string
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    carros: 0,
    anuncios: 0,
    pecas: 0,
    vendas: 0,
    utilizadores: 0,
  })

  const [vendas, setVendas] = useState<Venda[]>([])
  const [reparacoes, setReparacoes] = useState<Reparacao[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const headers = { Authorization: `Bearer ${token}` }

        const [
          carrosRes,
          anunciosRes,
          pecasRes,
          vendasRes,
          usersRes,
          reparacoesRes
        ] = await Promise.all([
          fetch('/api/mecanico/carros', { headers }),
          fetch('/api/mecanico/anuncios', { headers }),
          fetch('/api/mecanico/pecas', { headers }),
          fetch('/api/admin/vendas', { headers }),
          fetch('/api/admin/users', { headers }),
          fetch('/api/admin/reparacoes', { headers }),
        ])

        const [carros, anuncios, pecas, vendasData, users, reparacoesData] = await Promise.all([
          carrosRes.json(),
          anunciosRes.json(),
          pecasRes.json(),
          vendasRes.json(),
          usersRes.json(),
          reparacoesRes.json(),
        ])

        setStats({
          carros: carros?.length || 0,
          anuncios: anuncios?.length || 0,
          pecas: pecas?.length || 0,
          vendas: vendasData?.length || 0,
          utilizadores: users?.length || 0,
        })

        setVendas((vendasData || []).slice(0, 5))
        setReparacoes(reparacoesData || [])
      } catch (err) {
        console.error("Erro ao carregar dashboard admin", err)
        setErro("Erro ao comunicar com o servidor.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const estadoCores = {
    PENDENTE: '#9CA3AF',
    ACEITE: '#3B82F6',
    REAGENDAR: '#F59E0B',
    CONCLUIDA: '#10B981',
    RECUSADA: '#EF4444',
  }

  const graficoData = reparacoes.reduce((acc: any, r) => {
    acc[r.estado] = (acc[r.estado] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(graficoData).map(([estado, total]) => ({
    estado,
    total,
  }))

  if (loading) return <p className="p-6">A carregar dashboard...</p>
  if (erro) return <p className="p-6 text-red-600">{erro}</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Admin</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(stats).map(([label, value]) => (
          <Card key={label}>
            <CardHeader><CardTitle>{label.charAt(0).toUpperCase() + label.slice(1)}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Últimas Vendas */}
      <Card>
        <CardHeader><CardTitle>Últimas Vendas</CardTitle></CardHeader>
        <CardContent>
          {vendas.length === 0 ? (
            <p>Nenhuma venda registada.</p>
          ) : (
            <ul className="space-y-2">
              {vendas.map((v) => (
                <li key={v.id} className="flex justify-between">
                  <span>{v.titulo}</span>
                  <span className="font-semibold">€{v.valor.toFixed(2).replace('.', ',')}</span>
                  <span className="text-sm">{new Date(v.data).toLocaleDateString('pt-PT')}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardHeader><CardTitle>Calendário de Reparações</CardTitle></CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            locale={ptLocale}
            events={reparacoes.map((r) => ({
              id: r.id.toString(),
              title: `${r.titulo}${r.descricao ? ` - ${r.descricao}` : ''}`,
              start: r.dataConfirmada || r.dataDesejada,
              color: estadoCores[r.estado as keyof typeof estadoCores] || '#888',
            }))}
          />
        </CardContent>
      </Card>

      {/* Gráfico */}
      <Card>
        <CardHeader><CardTitle>Reparações por Estado</CardTitle></CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="estado" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={estadoCores[entry.estado as keyof typeof estadoCores] || '#9CA3AF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

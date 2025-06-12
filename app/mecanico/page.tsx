'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { Badge } from '@/components/domains/shared/ui/badge'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import ptLocale from '@fullcalendar/core/locales/pt'

interface Reparacao {
  id: number
  titulo: string
  estado: string
  dataConfirmada: string | null
  dataDesejada: string
}

interface Peca {
  id: number
  nome: string
  quantidade: number
}

interface User {
  name: string
}

export default function HomePageMecanico() {
  const [user, setUser] = useState<User | null>(null)
  const [pendentes, setPendentes] = useState<Reparacao[]>([])
  const [minhas, setMinhas] = useState<Reparacao[]>([])
  const [pecas, setPecas] = useState<Peca[]>([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const headers = { Authorization: `Bearer ${token}` }

        const [userRes, reparacoesRes, pecasRes] = await Promise.all([
          fetch('/api/auth/me', { headers }),
          fetch('/api/mecanico/reparacoes', { headers }),
          fetch('/api/mecanico/pecas', { headers }),
        ])

        const userData = await userRes.json()
        const reparacoesData = await reparacoesRes.json()
        const pecasData = await pecasRes.json()

        setUser(userData)
        setPendentes(reparacoesData.pendentes || [])
        setMinhas(reparacoesData.minhasReparacoes || [])
        setPecas(pecasData || [])
      } catch (err) {
        console.error('Erro ao carregar dashboard do mecânico:', err)
      }
    }

    fetchDashboard()
  }, [])

  const pecasCriticas = pecas.filter(p => p.quantidade < 5)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Bem-vindo ao painel, {user?.name || 'mecânico'} !
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Reparações Atribuídas</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{minhas.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reparações Pendentes</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendentes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Peças em Stock Crítico</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pecasCriticas.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendário */}
      <Card>
        <CardHeader><CardTitle>Próximas Reparações</CardTitle></CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={ptLocale}
            events={minhas.map(rep => ({
              title: rep.titulo,
              start: rep.dataConfirmada || rep.dataDesejada,
              color: rep.estado === 'REAGENDAR' ? 'orange' : rep.estado === 'CONCLUIDA' ? 'green' : 'blue'
            }))}
            height="auto"
          />
        </CardContent>
      </Card>

      {/* Lista rápida */}
      <Card>
        <CardHeader><CardTitle>Reparações Recentes</CardTitle></CardHeader>
        <CardContent>
          {minhas.length === 0 ? (
            <p className="text-gray-500">Sem reparações atribuídas ainda.</p>
          ) : (
            <ul className="space-y-2">
              {minhas.slice(0, 5).map((r) => (
                <li key={r.id} className="flex justify-between">
                  <span>{r.titulo}</span>
                  <Badge>{r.estado}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import ptLocale from "@fullcalendar/core/locales/pt"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/table"
import ReagendarModal from "@/components/domains/mecanico/reagendar/reagendarmodal"

export default function HomePageUser() {
  const [pendentes, setPendentes] = useState([])
  const [minhasReparacoes, setMinhasReparacoes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<any>(null)

  const fetchReparacoes = async () => {
    const res = await fetch("/api/mecanico/reparacoes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })

    const data = await res.json()
    if (data.pendentes) setPendentes(data.pendentes)
    if (data.minhasReparacoes) setMinhasReparacoes(data.minhasReparacoes)
  }

  useEffect(() => {
    fetchReparacoes()
  }, [])

  const atualizarEstado = async (
    id: number,
    estado: string,
    novaData?: string
  ) => {
    const res = await fetch(`/api/mecanico/reparacoes/estado/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ estado, novaData }),
    })

    if (res.ok) {
      await fetchReparacoes()
      setModalAberto(false)
    } else {
      alert("Erro ao atualizar reparação.")
    }
  }

  return (
    <div className="w-full p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Reparações</CardTitle>
        </CardHeader>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            locale={ptLocale}
            events={minhasReparacoes.map((r: any) => ({
              id: String(r.id),
              title: r.titulo,
              start: r.dataConfirmada || r.dataDesejada,
              end: r.dataConfirmada || r.dataDesejada,
              color:
                r.estado === "REAGENDAR"
                  ? "orange"
                  : r.estado === "CONCLUIDA"
                  ? "green"
                  : "blue",
              extendedProps: { detalhes: r },
            }))}
            eventClick={(info) => {
              setDetalhesSelecionados(info.event.extendedProps.detalhes)
              setModalAberto(true)
            }}
          />

          {/* Legenda de cores */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500" />
              Reparações Aceites
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-orange-400" />
              Reagendadas
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500" />
              Concluídas
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reparações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {pendentes.length === 0 ? (
            <p className="text-gray-600">Nenhuma reparação pendente de momento.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Carro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendentes.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.titulo}</TableCell>
                    <TableCell>{r.descricao || "-"}</TableCell>
                    <TableCell>{new Date(r.dataDesejada).toLocaleString()}</TableCell>
                    <TableCell>
                      {r.carro
                        ? `${r.carro.marca} ${r.carro.modelo} (${r.carro.matricula})`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => atualizarEstado(r.id, "ACEITE")}
                      >
                        Aceitar
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => atualizarEstado(r.id, "RECUSADA")}
                      >
                        Recusar
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => {
                          setDetalhesSelecionados(r)
                          setModalAberto(true)
                        }}
                      >
                        Reagendar
                      </button>
                      {(r.estado === "ACEITE" || r.estado === "REAGENDAR") && (
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => atualizarEstado(r.id, "CONCLUIDA")}
                        >
                          Concluir
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ReagendarModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        detalhes={detalhesSelecionados}
        onReagendar={async (id, novaData) => {
          if (novaData) {
            await atualizarEstado(id, "REAGENDAR", novaData)
          } else {
            await atualizarEstado(id, "CONCLUIDA")
          }
        }}
      />
    </div>
  )
}

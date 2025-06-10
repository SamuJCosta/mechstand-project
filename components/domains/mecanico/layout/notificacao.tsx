"use client"

import { useEffect, useState, useRef } from "react"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import eventBus from "@/lib/eventbus"

interface Notificacao {
  id: number
  mensagem: string
  lida: boolean
  createdAt: string
}

export function NotificacaoDropdown() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchNotificacoes = async () => {
    try {
      const res = await fetch("/api/mecanico/notificacoes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      const data = await res.json()
      if (res.ok) {
        setNotificacoes(data.notificacoes)
      }
    } catch (err) {
      console.error("Erro ao carregar notificações")
    }
  }

  const marcarComoLida = async (id: number) => {
    try {
      await fetch(`/api/mecanico/notificacoes/marcarlida/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      fetchNotificacoes()
    } catch (err) {
      console.error("Erro ao marcar como lida")
    }
  }

  // Inicial + ouvir eventos globais
  useEffect(() => {
    fetchNotificacoes()

    const handleRefresh = () => fetchNotificacoes()
    eventBus.addEventListener("notificacoes:refresh", handleRefresh)

    return () => {
      eventBus.removeEventListener("notificacoes:refresh", handleRefresh)
    }
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida)

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="relative text-muted-foreground hover:text-foreground">
        <Bell className="h-5 w-5" />
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
            {notificacoesNaoLidas.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 border text-sm overflow-hidden">
          <div className="p-4 font-semibold border-b">Notificações</div>
          {notificacoes.length === 0 ? (
            <div className="p-4 text-gray-500">Sem notificações</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {notificacoes.map((n) => (
                <li
                  key={n.id}
                  className={`flex justify-between items-start gap-2 p-3 border-b hover:bg-gray-50 ${
                    n.lida ? "text-gray-500" : "text-black font-medium"
                  }`}
                >
                  <div>{n.mensagem}</div>
                  {!n.lida && (
                    <button
                      onClick={() => marcarComoLida(n.id)}
                      className="text-xs text-black hover:underline"
                    >
                      Marcar como lida
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="text-center p-2 border-t bg-gray-50">
            <button
              onClick={() => {
                setOpen(false)
                router.push("/mecanico/sidebar/notificacoes")
              }}
              className="text-black hover:underline text-sm"
            >
              Ver todas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

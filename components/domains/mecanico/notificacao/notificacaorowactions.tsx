"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import eventBus from "@/lib/eventbus"

export const NotificacaoRowActions = ({
  id,
  lida,
  onRefresh,
}: {
  id: number
  lida: boolean
  onRefresh: () => void
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const marcarComoLida = async () => {
    setLoading(true)
    await fetch(`/api/mecanico/notificacoes/marcarlida/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    eventBus.dispatchEvent(new Event("notificacoes:refresh"))
    onRefresh()
    setLoading(false)
  }

  const removerNotificacao = async () => {
    setLoading(true)
    await fetch(`/api/mecanico/notificacoes/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    eventBus.dispatchEvent(new Event("notificacoes:refresh"))
    onRefresh()
    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100">
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!lida && (
          <DropdownMenuItem onClick={marcarComoLida} disabled={loading}>
            Marcar como lida
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={removerNotificacao} disabled={loading}>
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

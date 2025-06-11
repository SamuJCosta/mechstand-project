"use client"

import { Dialog } from "@headlessui/react"
import { Button } from "@/components/domains/shared/ui/button"

type Props = {
  isOpen: boolean
  onClose: () => void
  detalhes: any
  mecanicos: any[]
  mecanicoId: string
  setMecanicoId: (val: string) => void
  atribuirMecanico: () => void
}

export default function AtribuirMecanicoModal({
  isOpen,
  onClose,
  detalhes,
  mecanicos,
  mecanicoId,
  setMecanicoId,
  atribuirMecanico,
}: Props) {
  if (!detalhes) return null

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 bg-black/30">
        <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full">
          <Dialog.Title className="text-lg font-bold mb-4">Atribuir Mecânico</Dialog.Title>
          <div className="space-y-4">
            <p><strong>Reparação:</strong> {detalhes.titulo}</p>
            <p><strong>Descrição:</strong> {detalhes.descricao || "-"}</p>
            <p><strong>Cliente:</strong> {detalhes.cliente?.name}</p>
            <select
              className="w-full border rounded p-2"
              value={mecanicoId}
              onChange={(e) => setMecanicoId(e.target.value)}
            >
              <option value="">Selecionar Mecânico</option>
              {mecanicos.map((m: any) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <Button className="w-full" onClick={atribuirMecanico}>
              Atribuir
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

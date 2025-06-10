'use client'

import { Dialog } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/domains/shared/ui/input'
import { Button } from '@/components/domains/shared/ui/button'

type Reparacao = {
  id: number
  titulo: string
  descricao: string
  dataDesejada: string
  carro?: {
    marca: string
    modelo: string
    matricula: string
  }
}

type Props = {
  isOpen: boolean
  onClose: () => void
  detalhes: Reparacao | null
  onReagendar: (id: number, novaData: string) => Promise<void>
}

export default function ReagendarModal({
  isOpen,
  onClose,
  detalhes,
  onReagendar,
}: Props) {
  const [novaData, setNovaData] = useState('')

  useEffect(() => {
    if (isOpen) setNovaData('')
  }, [isOpen])

  if (!detalhes) return null

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
          <Dialog.Title className="text-xl font-bold mb-4">
            Detalhes da Reparação
          </Dialog.Title>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Título:</strong> {detalhes.titulo}</p>
            <p><strong>Descrição:</strong> {detalhes.descricao || '-'}</p>
            <p><strong>Data Desejada:</strong> {new Date(detalhes.dataDesejada).toLocaleString()}</p>
            <p><strong>Carro:</strong> {detalhes.carro
              ? `${detalhes.carro.marca} ${detalhes.carro.modelo} (${detalhes.carro.matricula})`
              : 'N/A'}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <label className="block font-medium">Nova data</label>
            <Input
              type="datetime-local"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
            />
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600"
              onClick={() => onReagendar(detalhes.id, novaData)}
            >
              Confirmar Reagendamento
            </Button>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => onReagendar(detalhes.id, "")}
            >
              Marcar como Concluída
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

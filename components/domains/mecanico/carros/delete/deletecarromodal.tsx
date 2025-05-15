'use client'

import { Dialog } from '@headlessui/react'
import { authFetch } from '@/utils/authFetch'
import { useState } from 'react'

export default function DeleteCarroModal({
  carroId,
  isOpen,
  onClose,
  onSuccess,
}: {
  carroId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await authFetch('/api/mecanico/carros/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id: carroId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao remover o carro.')
        setLoading(false)
        return
      }

      onClose()
      onSuccess?.()
    } catch (err) {
      setError('Erro ao remover o carro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto font-poppins">
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold text-center mb-4">Remover Carro</Dialog.Title>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <p className="text-center mb-6">Tens a certeza que queres remover este carro?</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? 'A remover...' : 'Remover'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

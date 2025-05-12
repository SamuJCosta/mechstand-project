'use client'

import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function DeletePecaModal({
  pecaId,
  isOpen,
  onClose,
  onSuccess,
}: {
  pecaId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    const res = await authFetch('/api/mecanico/pecas/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id: pecaId }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Erro ao remover peça')
    } else {
      onClose()
      onSuccess?.()
    }

    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
          <Dialog.Title className="text-xl font-semibold mb-4">Remover Peça</Dialog.Title>
          <p className="mb-4">Tens a certeza que queres remover esta peça do stock?</p>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              {loading ? 'A remover...' : 'Remover'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function DeleteAnuncioModal({
  anuncioId,
  isOpen,
  onClose,
  onSuccess,
}: {
  anuncioId: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleDelete = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await authFetch('/api/mecanico/anuncios/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id: anuncioId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao apagar anúncio.')
        setLoading(false)
        return
      }

      onSuccess?.()
      onClose()
    } catch {
      setError('Erro ao apagar anúncio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirmar remoção</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <p>Tem certeza que deseja remover este anúncio?</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </div>
  )
}

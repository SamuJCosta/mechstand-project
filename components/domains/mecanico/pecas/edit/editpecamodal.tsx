'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function EditPecaModal({
  peca,
  isOpen,
  onClose,
  onSuccess,
}: {
  peca: any
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(0)
  const [preco, setPreco] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (peca) {
      setNome(peca.nome)
      setDescricao(peca.descricao || '')
      setQuantidade(peca.quantidade)
      setPreco(peca.preco)
    }
  }, [peca])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authFetch('/api/mecanico/pecas/edit', {
        method: 'PUT',
        body: JSON.stringify({ id: peca.id, nome, descricao, quantidade, preco }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao atualizar a peça.')
        setLoading(false)
        return
      }

      onClose()
      onSuccess?.()
    } catch (error) {
      setError('Erro ao atualizar a peça. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto font-poppins">
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
          <div className="mb-6 text-center">
            <Dialog.Title className="text-3xl font-bold">Editar Peça</Dialog.Title>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
            />
            <textarea
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
              min={0}
            />
            <input
              type="number"
              placeholder="Preço (€)"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
              step="0.01"
              min={0}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              {loading ? 'A atualizar...' : 'Guardar'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

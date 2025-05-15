'use client'

import { useState, useEffect, useRef } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function EditAnuncioModal({
  anuncio,
  isOpen,
  onClose,
  onSuccess,
}: {
  anuncio: any
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [status, setStatus] = useState('disponivel')
  const [imagens, setImagens] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (anuncio && isOpen) {
      setTitulo(anuncio.titulo)
      setDescricao(anuncio.descricao || '')
      setPreco(anuncio.preco?.toString() || '')
      setStatus(anuncio.status || 'disponivel')
      setImagens(anuncio.imagens?.map((img: any) => img.url) ?? [])
      setError('')
    }
  }, [anuncio, isOpen])

  // Remove imagem por índice
  const removeImagem = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index))
  }

  // Adiciona imagens novas do input file
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagens((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!titulo.trim() || !preco.trim() || imagens.length === 0) {
      setError('Preencha os campos obrigatórios e adicione pelo menos uma imagem.')
      setLoading(false)
      return
    }

    try {
      const response = await authFetch('/api/mecanico/anuncios/edit', {
        method: 'PUT',
        body: JSON.stringify({
          id: anuncio.id,
          titulo,
          descricao,
          preco: parseFloat(preco),
          status,
          imagens,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao atualizar o anúncio.')
        setLoading(false)
        return
      }

      onSuccess?.()
      onClose()
    } catch {
      setError('Erro ao atualizar o anúncio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Editar Anúncio</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Preço (€) *</label>
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="disponivel">Disponível</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Imagens *</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagemChange}
              className="mb-2"
            />

            <div className="flex flex-wrap gap-2">
              {imagens.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded overflow-hidden border">
                  <img src={img} alt={`Imagem ${i + 1}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImagem(i)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl px-1"
                    aria-label="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
          >
            {loading ? 'A atualizar...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}

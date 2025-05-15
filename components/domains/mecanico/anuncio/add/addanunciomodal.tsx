'use client'

import { useState, useEffect } from 'react'
import { authFetch } from '@/utils/authFetch'

type Carro = {
  id: number
  marca: string
  modelo: string
  matricula: string
}

export default function AddAnuncioModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [carros, setCarros] = useState<Carro[]>([])
  const [carroSelecionado, setCarroSelecionado] = useState<number | null>(null)
  const [imagens, setImagens] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setTitulo('')
      setDescricao('')
      setPreco('')
      setCarroSelecionado(null)
      setImagens([])
      setError('')
    }
  }, [isOpen])

  useEffect(() => {
    async function fetchCarros() {
      try {
        const res = await authFetch('/api/mecanico/carros')
        if (!res.ok) throw new Error('Erro ao carregar carros')
        const data = await res.json()
        setCarros(data)
      } catch {
        setError('Não foi possível carregar os carros.')
      }
    }
    if (isOpen) fetchCarros()
  }, [isOpen])

  function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagens((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Reset input so same file can be re-selected if needed
    e.target.value = ''
  }

  function removeImagem(index: number) {
    setImagens((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!carroSelecionado) {
      setError('Seleciona um carro.')
      setLoading(false)
      return
    }

    if (!titulo.trim() || !preco.trim() || imagens.length === 0) {
      setError('Preenche os campos obrigatórios e adiciona pelo menos uma imagem.')
      setLoading(false)
      return
    }

    try {
      const response = await authFetch('/api/mecanico/anuncios/create', {
        method: 'POST',
        body: JSON.stringify({
          titulo,
          descricao,
          preco: parseFloat(preco),
          carroId: carroSelecionado,
          imagens,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao criar anúncio.')
        setLoading(false)
        return
      }

      onSuccess?.()
      onClose()
    } catch {
      setError('Erro ao criar anúncio. Tente novamente.')
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
        <h2 className="text-2xl font-bold mb-4">Criar Anúncio</h2>

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
            <label className="block font-medium mb-1">Carro *</label>
            <select
              value={carroSelecionado ?? ''}
              onChange={(e) => setCarroSelecionado(Number(e.target.value))}
              className="w-full border rounded p-2"
              required
            >
              <option value="" disabled>
                -- Selecione um carro --
              </option>
              {carros.map((carro) => (
                <option key={carro.id} value={carro.id}>
                  {carro.marca} {carro.modelo} ({carro.matricula})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Imagens *</label>
            <input
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
            {loading ? 'Criando...' : 'Criar Anúncio'}
          </button>
        </form>
      </div>
    </div>
  )
}

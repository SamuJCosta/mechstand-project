'use client'

import { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface Carro {
  id: number
  marca: string
  modelo: string
  matricula: string
}

interface Mecanico {
  id: number
  name: string
  media: number | null
  totalAvaliacoes: number
}

export default function AgendarReparacaoModal({ isOpen, onClose, onSuccess }: Props) {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataDesejada, setDataDesejada] = useState("")
  const [carroId, setCarroId] = useState<number | "">("")
  const [mecanicoId, setMecanicoId] = useState<number | "">("")
  const [carros, setCarros] = useState<Carro[]>([])
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (!isOpen) return

    const fetchCarros = async () => {
      try {
        const res = await fetch("/api/clientes/carroautenticado", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        const data = await res.json()
        if (res.ok) {
          setCarros(data.carros)
        } else {
          console.error(data.error)
        }
      } catch (err) {
        console.error("Erro ao buscar carros")
      }
    }

    const fetchMecanicos = async () => {
      try {
        const res = await fetch("/api/clientes/mecanicos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setMecanicos(data)
        }
      } catch (err) {
        console.error("Erro ao buscar mecânicos")
      }
    }

    fetchCarros()
    fetchMecanicos()
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")

    try {
      const res = await fetch("/api/clientes/reparacao/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          dataDesejada,
          carroId: carroId || null,
          mecanicoId: mecanicoId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || "Erro ao agendar.")
      } else {
        onSuccess()
        handleClose()
      }
    } catch (err) {
      setErro("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitulo("")
    setDescricao("")
    setDataDesejada("")
    setCarroId("")
    setMecanicoId("")
    setErro("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-xl font-bold">Agendar Reparação</h2>

        <div>
          <label className="block font-medium">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Data desejada *</label>
          <input
            type="datetime-local"
            value={dataDesejada}
            onChange={(e) => setDataDesejada(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Veículo</label>
          {carros.length > 0 ? (
            <select
              value={carroId}
              onChange={(e) => setCarroId(e.target.value ? parseInt(e.target.value) : "")}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Não associar --</option>
              {carros.map((carro) => (
                <option key={carro.id} value={carro.id}>
                  {carro.marca} {carro.modelo} ({carro.matricula})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-gray-600">Sem veículos registados.</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Mecânico</label>
          <select
            value={mecanicoId}
            onChange={(e) => setMecanicoId(e.target.value ? parseInt(e.target.value) : "")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Sem preferência --</option>
            {mecanicos.map((mec) => (
              <option key={mec.id} value={mec.id}>
                {mec.name} {mec.media ? `⭐ ${mec.media} (${mec.totalAvaliacoes})` : "(Sem avaliações)"}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="text-red-600">{erro}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "A enviar..." : "Agendar"}
          </button>
        </div>
      </form>
    </div>
  )
}

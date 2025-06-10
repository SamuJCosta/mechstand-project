"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Carro {
  id: number
  marca: string
  modelo: string
  matricula: string
}

export default function AgendarReparacaoForm() {
  const router = useRouter()
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [dataDesejada, setDataDesejada] = useState("")
  const [carroId, setCarroId] = useState<number | "">("")
  const [carros, setCarros] = useState<Carro[]>([])

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
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

    fetchCarros()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro("")
    setSucesso("")

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
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.error || "Erro ao agendar.")
      } else {
        setSucesso("Reparação agendada com sucesso!")
        setTitulo("")
        setDescricao("")
        setDataDesejada("")
        setCarroId("")
      }
    } catch (err) {
      setErro("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold">Agendar Reparação</h2>

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
          rows={4}
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
        <label className="block font-medium">Associar a um veículo</label>
        {carros.length > 0 ? (
          <select
            value={carroId}
            onChange={(e) => setCarroId(e.target.value ? parseInt(e.target.value) : "")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Não associar a nenhum veículo --</option>
            {carros.map((carro) => (
              <option key={carro.id} value={carro.id}>
                {carro.marca} {carro.modelo} ({carro.matricula})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-600">Não tem veículos registados.</p>
        )}
      </div>

      {erro && <p className="text-red-600">{erro}</p>}
      {sucesso && <p className="text-green-600">{sucesso}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-black"
      >
        {loading ? "A enviar..." : "Agendar"}
      </button>
    </form>
  )
}

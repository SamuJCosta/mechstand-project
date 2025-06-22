'use client'

import { useState } from "react"
import toast from "react-hot-toast"

export default function RatingModal({
  reparacao,
  onClose,
}: {
  reparacao: {
    id: number
    titulo: string
    mecanicoId: number
    mecanico?: { name: string }
  }
  onClose: () => void
}) {
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState(false)

  const enviarAvaliacao = async () => {
    if (rating === 0) {
      toast.error("Seleciona uma nota de 1 a 5 estrelas.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/avaliacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        nota: rating,
        comentario,
        reparacaoId: reparacao.id,
        mecanicoId: reparacao.mecanicoId,
      }),
    })

    setLoading(false)

    if (res.ok) {
      toast.success("Avaliação enviada com sucesso!")
      localStorage.setItem(`avaliado_${reparacao.id}`, "true")
      onClose()
    } else {
      const erro = await res.json()
      toast.error(erro?.error || "Erro ao enviar avaliação.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold">Avaliar Mecânico</h2>

        <p className="text-sm text-black break-words whitespace-pre-wrap">
          Reparação: <strong>{reparacao.titulo}</strong>
        </p>

        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="text-2xl"
              aria-label={`${n} estrelas`}
            >
              {n <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        <textarea
          placeholder="Comentário (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded resize-none max-h-40 overflow-y-auto"
          rows={3}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={enviarAvaliacao}
            disabled={loading}
            className="px-4 py-1 rounded bg-black text-white"
          >
            {loading ? "A enviar..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  )
}

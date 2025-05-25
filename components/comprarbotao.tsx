'use client'

import { useEffect, useState } from 'react'

interface Props {
  titulo: string
  preco: number
  anuncioId: number
}

export default function ComprarBotao({ titulo, preco, anuncioId }: Props) {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setRole(null)
      setLoading(false)
      return
    }

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role)
      })
      .catch(() => setRole(null))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert('Precisas de estar autenticado para comprar.')
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, preco, anuncioId }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert(data.error || 'Erro ao redirecionar para o checkout.')
    }
  }

  if (loading) return null

  if (role !== 'CLIENT') return null

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-5 py-2 rounded-lg font-medium w-full mt-3"
    >
      Comprar agora
    </button>
  )
}

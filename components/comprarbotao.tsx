'use client'

interface Props {
  titulo: string
  preco: number
  anuncioId: number
}

export default function ComprarBotao({ titulo, preco, anuncioId }: Props) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const handleClick = async () => {
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

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-5 py-2 rounded-lg font-medium w-full mt-3"
    >
      Comprar agora
    </button>
  )
}

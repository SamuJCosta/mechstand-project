'use client'

export function MarkAsReadButton({ id }: { id: number }) {
  const handleClick = async () => {
    await fetch(`/api/mecanico/notificacoes/marcarlida/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    window.location.reload()
  }

  return (
    <button onClick={handleClick} className="text-black text-sm hover:underline">
      Marcar como lida
    </button>
  )
}

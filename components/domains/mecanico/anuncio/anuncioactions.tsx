'use client'

import { useState } from 'react'
import AddAnuncioModal from './add/addanunciomodal' // Ajusta o caminho conforme estrutura
import { useRouter } from 'next/navigation'

export function AnuncioActions() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <div className="flex justify-end gap-4 w-full px-6">
        <button
          className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
          onClick={() => alert('Exportar ainda não implementado')}
        >
          Exportar
        </button>
        <button
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          onClick={() => setOpen(true)}
        >
          + Adicionar Anúncio
        </button>
      </div>

      <AddAnuncioModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

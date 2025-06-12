'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AgendarReparacaoModal from './agendarreparacaomodal'

interface Props {
  onSuccess: () => void
}

export function ReparacaoActions({ onSuccess }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex justify-end gap-4 w-full px-6">
        <button
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
          onClick={() => setOpen(true)}
        >
          + Agendar Reparação
        </button>
      </div>

      <AgendarReparacaoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          onSuccess()
          setOpen(false)
        }}
      />
    </>
  )
}

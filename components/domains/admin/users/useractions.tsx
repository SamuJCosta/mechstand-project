'use client'

import { useState } from "react"
import AddUserModal from "./add/addusermodal"

export function UserActions() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex gap-4">
        <button
          className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
          onClick={() => alert('Exportar ainda não implementado')}
        >
          Exportar
        </button>
        <button
          className="bg-black text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-800"
          onClick={() => setOpen(true)}
        >
          + Adicionar Utilizador
        </button>
      </div>

      <AddUserModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}

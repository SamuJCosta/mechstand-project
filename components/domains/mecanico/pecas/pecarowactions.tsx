'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import EditPecaModal from './edit/editpecamodal'
import DeletePecaModal from './delete/deletepecamodal'
import { useRouter } from 'next/navigation'

export const PecaRowActions = ({ peca }: { peca: any }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPecaModal
        peca={peca}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => router.refresh()}
      />
      <DeletePecaModal
        pecaId={peca.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import EditAnuncioModal from './edit/editanunciomodal'
import DeleteAnuncioModal from './delete/deleteanunciomodal'

export const AnuncioRowActions = ({ anuncio }: { anuncio: any }) => {
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

      <EditAnuncioModal
        anuncio={anuncio}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => router.refresh()}
      />
      <DeleteAnuncioModal
        anuncioId={anuncio.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

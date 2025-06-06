'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import EditUserModal from './edit/editusermodal'
import DeleteUserModal from './delete/deleteusermodal'
import { useRouter } from 'next/navigation'

export const UserRowActions = ({ user }: { user: any }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
    setEditOpen(false)
    setDeleteOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 rounded hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>Editar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>Remover</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserModal
        user={user}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={handleSuccess}
      />
      <DeleteUserModal
        userId={user.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}

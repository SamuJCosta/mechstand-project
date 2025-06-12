'use client'

import { Dialog } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { authFetch } from '@/utils/authFetch'

export default function EditarPerfilModal({ isOpen, onClose, user, onUpdate }: {
  isOpen: boolean
  onClose: () => void
  user: { name: string; email: string; profileImage?: string }
  onUpdate: () => void
}) {
  const [name, setName] = useState(user.name)
  const [profileImage, setProfileImage] = useState(user.profileImage || '/userimage.png')
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authFetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profileImage }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao atualizar perfil')
        return
      }
      onUpdate()
      onClose()
    } catch {
      setError('Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-bold mb-4">Editar Perfil</Dialog.Title>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2 font-medium">Foto de perfil</label>
        <img src={profileImage} alt="Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

"use client"

import { Dialog } from "@headlessui/react"
import Image from "next/image"
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { TfiEmail } from "react-icons/tfi"
import { useState, useEffect } from "react"
import { authFetch } from "@/utils/authFetch"

export default function EditUserModal({ user, isOpen, onClose }: { user: any; isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("CLIENT")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setUsername(user.username)
      setEmail(user.email)
      setRole(user.role)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authFetch("/api/admin/users/edit", {
        method: "PUT",
        body: JSON.stringify({ id: user.id, name, username, email, role }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Erro ao atualizar utilizador.")
        setLoading(false)
        return
      }

      onClose()
      setLoading(false)
    } catch (error) {
      setError("Erro ao atualizar utilizador. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto font-poppins">
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl">
          {/* LOGO + TÍTULO */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="MechStand" width={100} height={100} />
            <Dialog.Title as="h1" className="text-3xl md:text-4xl font-bold text-black mt-4">
              Editar Utilizador
            </Dialog.Title>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-black">Nome</label>
              <UserIcon className="absolute left-3 top-10 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-black">Username</label>
              <UserIcon className="absolute left-3 top-10 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-black">Email</label>
              <TfiEmail className="absolute left-3 top-10 w-5 h-5 text-black" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-black">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-3 pr-3 py-3 border rounded-lg bg-gray-100 text-black"
              >
                <option value="CLIENT">Cliente</option>
                <option value="MECANICO">Mecânico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "A atualizar..." : "Guardar"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

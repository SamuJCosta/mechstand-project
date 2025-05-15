'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { authFetch } from '@/utils/authFetch'

type Cliente = {
  id: number
  name: string
  email: string
}

type CarroForm = {
  matricula: string
  marca: string
  modelo: string
  ano: string
  tipoCombustivel: string
  potencia: string
  cilindrada: string
  quilometragem: string
  imagemUrl: string
  donoId: string
}

const combustiveis = ['Diesel', 'Gasolina', 'Elétrico', 'GPL']

export default function EditCarroModal({
  carro,
  isOpen,
  onClose,
  onSuccess,
}: {
  carro: any
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}) {
  const [form, setForm] = useState<CarroForm>({
    matricula: '',
    marca: '',
    modelo: '',
    ano: '',
    tipoCombustivel: '',
    potencia: '',
    cilindrada: '',
    quilometragem: '',
    imagemUrl: '',
    donoId: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [query, setQuery] = useState('')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  useEffect(() => {
    if (carro) {
      setForm({
        matricula: carro.matricula ?? '',
        marca: carro.marca ?? '',
        modelo: carro.modelo ?? '',
        ano: carro.ano?.toString() ?? '',
        tipoCombustivel: carro.tipoCombustivel ?? '',
        potencia: carro.potencia?.toString() ?? '',
        cilindrada: carro.cilindrada?.toString() ?? '',
        quilometragem: carro.quilometragem?.toString() ?? '',
        imagemUrl: carro.imagemUrl ?? '',
        donoId: carro.donoId?.toString() ?? '',
      })
      if (carro.donoId && carro.dono) {
        setSelectedCliente({
          id: carro.donoId,
          name: carro.dono.name,
          email: carro.dono.email,
        })
      }
    }
  }, [carro])

  useEffect(() => {
    const fetchClientes = async () => {
      if (!query) return setClientes([])
      try {
        const res = await authFetch(`/api/admin/clientes?query=${query}`)
        const data = await res.json()
        setClientes(data || [])
      } catch {
        setClientes([])
      }
    }
    const timeout = setTimeout(fetchClientes, 300)
    return () => clearTimeout(timeout)
  }, [query])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'matricula') {
      setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imagemUrl: '' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagemUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const matriculaRegex = /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/
    if (!matriculaRegex.test(form.matricula)) {
      setError(
        'A matrícula deve seguir o formato XX-XX-XX, com letras maiúsculas ou números.'
      )
      setLoading(false)
      return
    }

    if (!form.tipoCombustivel) {
      setError('Por favor, selecione o tipo de combustível.')
      setLoading(false)
      return
    }

    try {
      const response = await authFetch('/api/mecanico/carros/edit', {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          id: carro.id,
          donoId: selectedCliente?.id ?? null,
          ano: parseInt(form.ano),
          potencia: parseInt(form.potencia),
          cilindrada: form.cilindrada ? parseInt(form.cilindrada) : null,
          quilometragem: parseInt(form.quilometragem),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao atualizar o carro.')
        setLoading(false)
        return
      }

      onClose()
      onSuccess?.()
    } catch {
      setError('Erro ao atualizar o carro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto font-poppins"
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="mb-6 text-center">
            <Dialog.Title className="text-3xl font-bold">Editar Carro</Dialog.Title>
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              ['matricula', 'Matrícula'],
              ['marca', 'Marca'],
              ['modelo', 'Modelo'],
              ['ano', 'Ano'],
              ['potencia', 'Potência (cv)'],
              ['cilindrada', 'Cilindrada (cm³)'],
              ['quilometragem', 'Quilometragem (km)'],
            ].map(([name, label]) => (
              <input
                key={name}
                name={name}
                type="text"
                placeholder={label}
                value={form[name as keyof CarroForm]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
              />
            ))}

            <select
              name="tipoCombustivel"
              value={form.tipoCombustivel}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
              required
            >
              <option value="" disabled>
                Seleciona o combustível
              </option>
              {combustiveis.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Imagem */}
            {form.imagemUrl ? (
              <div className="relative w-48 mx-auto">
                <img
                  src={form.imagemUrl}
                  alt="Imagem do carro"
                  className="rounded-md w-full h-auto"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90"
                  aria-label="Remover imagem"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="block text-sm font-medium text-gray-700">
                Imagem do carro (upload)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded file:border file:border-gray-300
                             file:text-sm file:font-semibold
                             file:bg-gray-100 file:text-gray-700
                             hover:file:bg-gray-200"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              {loading ? 'A atualizar...' : 'Guardar'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

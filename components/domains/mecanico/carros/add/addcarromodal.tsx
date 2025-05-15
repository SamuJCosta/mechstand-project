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

export default function AddCarroModal({
  isOpen,
  onClose,
  onSuccess,
}: {
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
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [query, setQuery] = useState('')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setLoading(true)
    setError('')

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
      const response = await authFetch('/api/mecanico/carros/create', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          donoId: selectedCliente?.id || null,
          ano: parseInt(form.ano),
          potencia: parseInt(form.potencia),
          cilindrada: form.cilindrada ? parseInt(form.cilindrada) : null,
          quilometragem: parseInt(form.quilometragem),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (data.error === 'Veículo já registado.') {
          setError('Este veículo já está registado no sistema.')
        } else {
          setError(data.error || 'Erro ao criar carro.')
        }
        setLoading(false)
        return
      }

      onClose()
      onSuccess?.()
    } catch {
      setError('Erro ao criar carro. Tente novamente.')
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
            <Dialog.Title className="text-3xl font-bold">Adicionar Carro</Dialog.Title>
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
                value={(form as any)[name]}
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

            <label className="block text-sm font-medium text-gray-700">
              Imagem do carro (upload)
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded file:border file:border-gray-300
                           file:text-sm file:font-semibold
                           file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
              />
            </label>

            <Combobox value={selectedCliente} onChange={setSelectedCliente}>
              <Combobox.Input
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                displayValue={(cliente: Cliente) =>
                  cliente ? `${cliente.name} (${cliente.email})` : ''
                }
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Procurar cliente (nome ou email)"
              />
              <Combobox.Options className="bg-white border mt-1 rounded-md shadow-md max-h-48 overflow-auto">
                {clientes.length === 0 && query !== '' ? (
                  <div className="px-4 py-2 text-gray-500">
                    Nenhum cliente encontrado
                  </div>
                ) : (
                  clientes.map((cliente) => (
                    <Combobox.Option
                      key={cliente.id}
                      value={cliente}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {cliente.name} ({cliente.email})
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Combobox>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              {loading ? 'A criar...' : 'Criar Carro'}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

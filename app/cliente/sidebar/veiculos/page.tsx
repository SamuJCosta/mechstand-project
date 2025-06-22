'use client'

import { useEffect, useState } from 'react'
import { authFetch } from '@/utils/authFetch'

type Carro = {
  id: number
  matricula: string
  marca: string
  modelo: string
  ano: number
  tipoCombustivel: string
  potencia: number
  cilindrada: number | null
  quilometragem: number
  imagemUrl?: string | null
}

export default function ClienteCarrosList() {
  const [carros, setCarros] = useState<Carro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCarros() {
      try {
        const res = await authFetch('/api/clientes/carros')
        if (!res.ok) throw new Error('Erro ao carregar carros')
        const data = await res.json()
        setCarros(data)
      } catch {
        setError('Não foi possível carregar os carros.')
      } finally {
        setLoading(false)
      }
    }
    fetchCarros()
  }, [])

  if (loading) return <p>Carregando carros...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (carros.length === 0) return <p>Sem carros registados.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {carros.map((carro) => (
        <div
          key={carro.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          {carro.imagemUrl ? (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={carro.imagemUrl}
                alt={`Imagem do carro ${carro.marca} ${carro.modelo}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              Sem imagem
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold truncate">
              {carro.marca} {carro.modelo} ({carro.matricula})
            </h3>
            <div className="text-sm text-gray-600 mt-1 flex-grow">
              <p><span className="font-medium">Ano:</span> {carro.ano}</p>
              <p><span className="font-medium">Combustível:</span> {carro.tipoCombustivel}</p>
              <p><span className="font-medium">Potência:</span> {carro.potencia} cv</p>
              <p><span className="font-medium">Cilindrada:</span> {carro.cilindrada ?? '-'}</p>
              <p><span className="font-medium">Quilometragem:</span> {carro.quilometragem} km</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

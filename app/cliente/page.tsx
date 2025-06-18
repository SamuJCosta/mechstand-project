'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card'
import { Badge } from '@/components/domains/shared/ui/badge'
import RatingModal from '@/components/domains/cliente/avaliacoes/ratingmodal'

interface Carro {
  id: number
  marca: string
  modelo: string
  matricula: string
}

interface Reparacao {
  id: number
  titulo: string
  estado: string
  dataDesejada: string
}

interface Anuncio {
  id: number
  titulo: string
  preco: number
  carro: {
    marca: string
    modelo: string
    matricula: string
  }
  imagens: { url: string }[]
}

interface User {
  name: string
}

interface ReparacaoParaAvaliar {
  id: number
  titulo: string
  mecanico?: {
    id: number
    name: string
  }
}

export default function HomePageCliente() {
  const [user, setUser] = useState<User | null>(null)
  const [carros, setCarros] = useState<Carro[]>([])
  const [reparacoes, setReparacoes] = useState<Reparacao[]>([])
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [avaliacaoPendente, setAvaliacaoPendente] = useState<ReparacaoParaAvaliar | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const headers = { Authorization: `Bearer ${token}` }

        const [userRes, carroRes, reparacaoRes, anuncioRes] = await Promise.all([
          fetch('/api/auth/me', { headers }),
          fetch('/api/clientes/carros', { headers }),
          fetch('/api/clientes/reparacao', { headers }),
          fetch('/api/stand/anuncios'),
        ])

        const userData = await userRes.json()
        const carrosData = await carroRes.json()
        const reparacoesData = await reparacaoRes.json()
        const anunciosData = await anuncioRes.json()

        setUser(userData)
        setCarros(Array.isArray(carrosData) ? carrosData : [])
        setReparacoes(
          Array.isArray(reparacoesData.reparacoes)
            ? reparacoesData.reparacoes
            : Array.isArray(reparacoesData)
            ? reparacoesData
            : []
        )
        setAnuncios(Array.isArray(anunciosData) ? anunciosData.slice(0, 3) : [])
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
        setError("Não foi possível carregar o dashboard do cliente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch para avaliação pendente
  useEffect(() => {
    const fetchPendentes = async () => {
      try {
        const res = await fetch("/api/clientes/reparacao/avaliar", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const id = data[0].id
          if (!localStorage.getItem(`avaliado_${id}`)) {
            setAvaliacaoPendente(data[0])
          }
        }
      } catch (err) {
        console.error("Erro ao buscar avaliações pendentes", err)
      }
    }

    fetchPendentes()
  }, [])

  const fecharModal = () => {
    if (avaliacaoPendente) {
      localStorage.setItem(`avaliado_${avaliacaoPendente.id}`, "true")
    }
    setAvaliacaoPendente(null)
  }

  if (error) return <p className="p-6 text-red-600">{error}</p>

  return (
    <>
      {avaliacaoPendente && (
        <RatingModal
          reparacao={{
            id: avaliacaoPendente.id,
            titulo: avaliacaoPendente.titulo,
            mecanicoId: avaliacaoPendente.mecanico?.id || 0,
            mecanico: { name: avaliacaoPendente.mecanico?.name || "Mecânico" },
          }}
          onClose={fecharModal}
        />
      )}

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Bem-vindo de volta{user?.name ? `, ${user.name}` : ''}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Carros Registados</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{carros.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Reparações Ativas</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {reparacoes.filter(r => r.estado !== 'CONCLUIDA').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Novos Anúncios</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{anuncios.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Últimas Reparações</CardTitle></CardHeader>
          <CardContent>
            {reparacoes.length === 0 ? (
              <p>Sem reparações ainda.</p>
            ) : (
              <ul className="space-y-2">
                {reparacoes.slice(0, 3).map(rep => (
                  <li key={rep.id} className="flex justify-between">
                    <span>{rep.titulo}</span>
                    <Badge>{rep.estado}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Novidades do Stand</CardTitle></CardHeader>
          <CardContent>
            {anuncios.length === 0 ? (
              <p>Sem anúncios no momento.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="border rounded p-2">
                    <img
                      src={anuncio.imagens[0]?.url || '/noimage.jpg'}
                      alt="Imagem"
                      className="w-full h-52 object-cover rounded"
                    />
                    <div className="mt-2 font-medium">
                      {anuncio.carro.marca} {anuncio.carro.modelo}
                    </div>
                    <div className="text-sm text-gray-600">{anuncio.titulo}</div>
                    <div className="mt-1 font-semibold">€{anuncio.preco.toFixed(2)}</div>
                    <Link href={`/anuncios/${anuncio.id}`} className="text-sm text-black">
                      Ver mais
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

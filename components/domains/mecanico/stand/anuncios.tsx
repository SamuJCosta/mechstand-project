"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import FiltrosCompacto from "../filtros/filtro"

type Anuncio = {
  id: number
  titulo: string
  preco: number
  descricao?: string
  carro: {
    marca: string
    modelo: string
    matricula: string
    ano: number
    quilometragem: number
    tipoCombustivel: string
  }
  imagens: { url: string }[]
}

export default function StandAnunciosList() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [filtros, setFiltros] = useState({
    marca: "",
    anoMin: null,
    anoMax: null,
    precoMin: null,
    precoMax: null,
    tipoCombustivel: "",
  })

  function limparFiltros() {
    setFiltros({
      marca: "",
      anoMin: null,
      anoMax: null,
      precoMin: null,
      precoMax: null,
      tipoCombustivel: "",
    })
  }

  useEffect(() => {
    async function fetchAnuncios() {
      try {
        const res = await fetch("/api/stand/anuncios")
        if (!res.ok) throw new Error("Erro ao carregar anúncios")
        const data = await res.json()
        setAnuncios(data)
      } catch {
        setError("Erro ao carregar anúncios do stand.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnuncios()
  }, [])

  // Filtragem local, aplica só os filtros preenchidos
  const anunciosFiltrados = anuncios.filter((a) => {
    if (
      filtros.marca &&
      !a.carro.marca.toLowerCase().includes(filtros.marca.toLowerCase())
    )
      return false
    if (filtros.anoMin !== null && a.carro.ano < filtros.anoMin) return false
    if (filtros.anoMax !== null && a.carro.ano > filtros.anoMax) return false
    if (filtros.precoMin !== null && a.preco < filtros.precoMin) return false
    if (filtros.precoMax !== null && a.preco > filtros.precoMax) return false
    if (
      filtros.tipoCombustivel &&
      a.carro.tipoCombustivel !== filtros.tipoCombustivel
    )
      return false

    return true
  })

  return (
    <>
      {/* FILTROS FORA DO CONTAINER LIMITADO */}
      <FiltrosCompacto
        filtros={filtros}
        setFiltros={setFiltros}
        limparFiltros={limparFiltros}
      />

      {/* CONTAINER LIMITADO PARA O RESTO */}
      <div className="px-4 font-poppins max-w-6xl mx-auto">
        {/* STATUS */}
        {loading && (
          <p className="text-black font-poppins p-4">Carregando anúncios...</p>
        )}
        {error && <p className="text-black font-poppins p-4">{error}</p>}
        {!loading && !error && anunciosFiltrados.length === 0 && (
          <p className="text-black font-poppins p-4">Nenhum anúncio encontrado.</p>
        )}

        {/* LISTA DE ANÚNCIOS */}
        {anunciosFiltrados.length > 0 && (
          <div className="flex flex-col space-y-6 w-full">
            {anunciosFiltrados.map((anuncio) => (
              <div
                key={anuncio.id}
                className="flex flex-col md:flex-row border border-black rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                onClick={() => alert(`Abrir detalhes do anúncio ${anuncio.id}`)}
                style={{ minHeight: "160px" }}
              >
                {/* Imagem */}
                <div className="md:w-1/3 h-48 md:h-auto flex-shrink-0 border-r border-black">
                  {anuncio.imagens[0] ? (
                    <img
                      src={anuncio.imagens[0].url}
                      alt={`Imagem do carro ${anuncio.carro.marca} ${anuncio.carro.modelo}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white text-black">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">{anuncio.titulo}</h2>
                    <p className="mt-1 font-semibold text-black">{`${anuncio.carro.marca} ${anuncio.carro.modelo} (${anuncio.carro.matricula})`}</p>

                    <div className="mt-2 flex flex-wrap gap-6 text-sm font-normal text-black">
                      <span>
                        <strong>Ano:</strong> {anuncio.carro.ano}
                      </span>
                      <span>
                        <strong>Quilometragem:</strong>{" "}
                        {anuncio.carro.quilometragem.toLocaleString()} km
                      </span>
                      <span>
                        <strong>Combustível:</strong> {anuncio.carro.tipoCombustivel}
                      </span>
                    </div>

                    {anuncio.descricao && (
                      <p className="mt-4 text-black font-normal line-clamp-4">
                        {anuncio.descricao}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xl font-bold text-black">
                      €{anuncio.preco.toFixed(2)}
                    </span>
                    <Link href={`/anuncios/${anuncio.id}`}>
                      <button
                        className="border border-black text-black px-5 py-2 rounded-lg font-normal hover:bg-black hover:text-white transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver detalhes
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

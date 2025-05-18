import { prisma } from '@/lib/prisma'
import Carrossel from './carrossel'
import {
  CarIcon,
  FuelIcon,
  GaugeIcon,
  CircleGauge,
  CalendarIcon,
  BadgeInfo,
  CalendarDays,
} from 'lucide-react'
import ComprarBotao from '../../../components/comprarbotao'

interface Props {
  params: { id: string }
}

export default async function AnuncioDetalhes({ params }: Props) {
  const id = parseInt(params?.id)

  if (isNaN(id)) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center text-red-600 font-poppins">
        ID inválido.
      </main>
    )
  }

  const anuncio = await prisma.anuncio.findUnique({
    where: { id },
    include: {
      carro: true,
      imagens: true,
    },
  })

  if (!anuncio) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center text-red-600 font-poppins">
        Anúncio não encontrado.
      </main>
    )
  }

  const { carro } = anuncio

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 font-poppins text-black">
      {/* Topo com Carrossel e Info */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 items-start mb-12">
        {/* Carrossel */}
        <div className="flex justify-center items-start">
          <Carrossel imagens={anuncio.imagens} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 pr-4 md:items-end text-left">
          <div className="w-full max-w-sm">
            <h1 className="text-4xl font-extrabold mb-7">{anuncio.titulo}</h1>
            <p className="text-3xl font-bold mb-6">€{anuncio.preco.toFixed(2)}</p>
            <ul className="space-y-1 text-lg">
              <li><strong>Marca:</strong> {carro.marca}</li>
              <li><strong>Modelo:</strong> {carro.modelo}</li>
              <li><strong>Matrícula:</strong> {carro.matricula}</li>
              <li><strong>Ano:</strong> {carro.ano}</li>
              <li><strong>Potência:</strong> {carro.potencia} cv</li>
              <li><strong>Cilindrada:</strong> {carro.cilindrada ?? 'N/D'} cc</li>
              <li><strong>Quilometragem:</strong> {carro.quilometragem.toLocaleString()} km</li>
              <li><strong>Combustível:</strong> {carro.tipoCombustivel}</li>
            </ul>
          </div>

          <div className="w-full max-w-sm">
            <ComprarBotao />
          </div>
        </div>
      </div>

      {/* Destaques */}
      <section className="border-t pt-10 mb-10">
        <h2 className="text-2xl font-bold mb-6">Destaques</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center text-sm text-black">
          <div className="flex flex-col items-center gap-1">
            <GaugeIcon className="w-6 h-6" />
            <span>{carro.quilometragem.toLocaleString()} km</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <FuelIcon className="w-6 h-6" />
            <span>{carro.tipoCombustivel}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <GaugeIcon className="w-6 h-6" />
            <span>{carro.cilindrada ?? 'N/D'} cm³</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CalendarIcon className="w-6 h-6" />
            <span>{carro.potencia} cv</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BadgeInfo className="w-6 h-6" />
            <span>{carro.modelo}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CalendarDays className="w-6 h-6" />
            <span>{carro.ano}</span>
          </div>
        </div>
      </section>

      {/* Descrição */}
      <section className="mt-17">
        <h2 className="text-2xl font-bold mb-6">Descrição</h2>
        <p className="text-black whitespace-pre-line">
          {anuncio.descricao || 'Sem descrição disponível.'}
        </p>
      </section>
    </main>
  )
}

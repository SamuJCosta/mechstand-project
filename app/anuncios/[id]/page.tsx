import { prisma } from '@/lib/prisma'
import Carrossel from './carrossel'

interface Props {
  params: { id: string }
}

export default async function AnuncioDetalhes({ params }: Props) {
  const anuncio = await prisma.anuncio.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      carro: true,
      imagens: true,
    },
  })

  if (!anuncio) {
    return (
      <main className="p-8 max-w-4xl mx-auto font-poppins text-center text-red-600">
        Anúncio não encontrado.
      </main>
    )
  }

  return (
    <main className="p-8 max-w-5xl mx-auto font-poppins text-black">
      <h1 className="text-4xl font-bold mb-6">{anuncio.titulo}</h1>

      <Carrossel imagens={anuncio.imagens} />

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Info principal */}
        <section className="md:w-2/3">
          <p className="text-3xl font-extrabold mb-6 text-black">
            €{anuncio.preco.toFixed(2)}
          </p>

          <p className="mb-6 whitespace-pre-line">
            {anuncio.descricao || 'Sem descrição disponível.'}
          </p>
        </section>

        {/* Detalhes do carro */}
        <section className="md:w-1/3 border-l border-gray-300 pl-6">
          <h2 className="text-2xl font-semibold mb-4">Detalhes do Carro</h2>
          <ul className="space-y-3 text-lg">
            <li><strong>Marca: </strong>{anuncio.carro.marca}</li>
            <li><strong>Modelo: </strong>{anuncio.carro.modelo}</li>
            <li><strong>Matrícula: </strong>{anuncio.carro.matricula}</li>
            <li><strong>Ano: </strong>{anuncio.carro.ano}</li>
            <li><strong>Quilometragem: </strong>{anuncio.carro.quilometragem.toLocaleString()} km</li>
            <li><strong>Combustível: </strong>{anuncio.carro.tipoCombustivel}</li>
          </ul>
        </section>
      </div>
    </main>
  )
}

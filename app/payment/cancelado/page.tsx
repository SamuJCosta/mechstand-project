'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PagamentoCancelado() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4 font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white overflow-hidden gap-10 border rounded-lg shadow-md p-8">
        {/* Texto de cancelamento */}
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-black mb-4">Pagamento Cancelado</h1>
          <p className="text-gray-800 text-lg mb-6">
            Parece que cancelou o pagamento. Pode tentar novamente quando quiser.
          </p>
          <Link
            href="/"
            className="bg-black text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-gray-800 transition w-full md:w-auto"
          >
            Voltar à Página Inicial
          </Link>
        </div>

        {/* Imagem de erro */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <Image
            src="/logo.png" // Coloca uma imagem como /cancel.png no teu public/
            alt="Cancelado"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

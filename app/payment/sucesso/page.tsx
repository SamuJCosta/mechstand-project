'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PagamentoSucesso() {
  const searchParams = useSearchParams()
  const anuncioId = searchParams.get('anuncioId')
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    if (anuncioId) {
      fetch('/api/payment/concluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anuncioId }),
      })
        .then(() => setConfirmado(true))
        .catch(() => setConfirmado(false))
    }
  }, [anuncioId])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4 font-poppins">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white overflow-hidden gap-10 border rounded-lg shadow-md p-8">
        <div className="flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-black mb-4">Pagamento Concluído!</h1>
          <p className="text-gray-800 text-lg mb-6">
            O seu pagamento foi processado com sucesso. Obrigado pela sua compra!
          </p>
          {confirmado && <p className="text-green-600 mb-4">Anúncio marcado como vendido!</p>}
          <Link
            href="/cliente"
            className="bg-black text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-gray-800 transition w-full md:w-auto"
          >
            Voltar à Área de Cliente
          </Link>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Sucesso"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

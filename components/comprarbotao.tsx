'use client'

export default function ComprarBotao() {
  return (
    <button
      className="bg-black text-white px-5 py-2 rounded-lg font-medium w-full mt-3"
      onClick={() => alert('Funcionalidade de compra futura')}
    >
      Comprar Veículo
    </button>
  )
}

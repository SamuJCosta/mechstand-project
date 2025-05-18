'use client'

import React, { useState } from 'react'

interface CarrosselProps {
  imagens: { url: string }[]
}

export default function Carrossel({ imagens }: CarrosselProps) {
  const [index, setIndex] = useState(0)

  if (imagens.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-md mb-8">
        Sem imagens
      </div>
    )
  }

  const prev = () => setIndex((old) => (old === 0 ? imagens.length - 1 : old - 1))
  const next = () => setIndex((old) => (old === imagens.length - 1 ? 0 : old + 1))

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden">
      <img
        src={imagens[index].url}
        alt={`Imagem ${index + 1}`}
        className="w-full h-[500px] object-contain bg-white rounded-md transition-all"
      />

      {imagens.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Imagem anterior"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Próxima imagem"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {imagens.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === index ? 'bg-black' : 'bg-gray-400'
                }`}
                aria-label={`Ir para imagem ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

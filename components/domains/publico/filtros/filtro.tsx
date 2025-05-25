import React from "react"

type FiltrosCompactoProps = {
  filtros: {
    marca: string
    anoMin?: number | null
    anoMax?: number | null
    precoMin?: number | null
    precoMax?: number | null
    tipoCombustivel: string
  }
  setFiltros: (filtros: any) => void
  limparFiltros: () => void
}

export default function FiltrosCompacto({ filtros, setFiltros, limparFiltros }: FiltrosCompactoProps) {
  return (
    <div className="max-w-screen-xl w-full mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200 font-poppins mb-8 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5 items-center">
        <input
          type="text"
          placeholder="Marca"
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.marca}
          onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
          autoComplete="off"
        />
        <input
          type="number"
          placeholder="Ano min"
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.anoMin ?? ""}
          onChange={(e) =>
            setFiltros({ ...filtros, anoMin: e.target.value ? Number(e.target.value) : null })
          }
          min={1900}
          max={new Date().getFullYear()}
        />
        <input
          type="number"
          placeholder="Ano max"
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.anoMax ?? ""}
          onChange={(e) =>
            setFiltros({ ...filtros, anoMax: e.target.value ? Number(e.target.value) : null })
          }
          min={1900}
          max={new Date().getFullYear()}
        />
        <input
          type="number"
          placeholder="Preço min (€)"
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.precoMin ?? ""}
          onChange={(e) =>
            setFiltros({ ...filtros, precoMin: e.target.value ? Number(e.target.value) : null })
          }
          min={0}
        />
        <input
          type="number"
          placeholder="Preço max (€)"
          className="border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.precoMax ?? ""}
          onChange={(e) =>
            setFiltros({ ...filtros, precoMax: e.target.value ? Number(e.target.value) : null })
          }
          min={0}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
          value={filtros.tipoCombustivel}
          onChange={(e) => setFiltros({ ...filtros, tipoCombustivel: e.target.value })}
        >
          <option value="">Combustível (todos)</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diesel">Diesel</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
        <button
          className="rounded-lg bg-black px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition w-full"
          onClick={limparFiltros}
          type="button"
          aria-label="Limpar filtros"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  )
}

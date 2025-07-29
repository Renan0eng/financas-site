"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { List } from "lucide-react"
import Link from "next/link"
import Papa from "papaparse"
import { useState } from "react"

interface Lancamento {
  data: string
  valor: number
  descricao: string
}

export default function HomePage() {
  const [mensagem, setMensagem] = useState("")

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const dados = (results.data as any[])
          .filter(row => row["Data"] && row["Valor"] && !isNaN(parseFloat(row["Valor"])))
          .map(row => ({
            data: row["Data"],
            valor: parseFloat(row["Valor"]),
            descricao: row["Descrição"],
            idBanco: row["Identificador"]
          }))

        const res = await fetch("/api/importar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lancamentos: dados }),
        })

        const json = await res.json()
        setMensagem(`Importados: ${json.inseridos}`)
      },
    })
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Importar Extrato Nubank</h1>
        <Link href="/esteira" className="text-blue-600 hover:underline ">
          <Button> <List /> Esteira </Button>
        </Link>
      </div>

      <Input type="file" accept=".csv" onChange={handleFileUpload} />

      {mensagem && <p className="mt-4 text-green-600 font-semibold">{mensagem}</p>}
    </main>
  )
}

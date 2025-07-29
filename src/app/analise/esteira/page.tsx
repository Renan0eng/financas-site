"use client"

import { Prisma } from "@prisma/client"
import { useEffect, useState } from "react"

type LancamentoWithClassificacao = Prisma.LancamentoGetPayload<{
    include: { classificacao: true }
}>

type EsteiraWithLancamento = Prisma.EsteiraGetPayload<{
    include: { lancamento: { include: { classificacao: true } } }
}>

export default function AnaliseEsteira() {
    const [dados, setDados] = useState<EsteiraWithLancamento[]>([])
    const [resumo, setResumo] = useState<Record<string, number>>({})

    useEffect(() => {
        fetch("/api/analise/esteira")
            .then(res => res.json())
            .then((data: EsteiraWithLancamento[]) => {
                setDados(data)

                const agrupar: Record<string, number> = {}
                data.forEach(e => {
                    const nome = e.lancamento?.classificacao?.nome || "Não classificado"
                    agrupar[nome] = (agrupar[nome] || 0) + e.valor
                })
                setResumo(agrupar)
            })
    }, [])

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Análise da Esteira</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(resumo).map(([nome, total]) => (
                    <div key={nome} className="rounded-xl border p-4 shadow">
                        <h2 className="text-lg font-semibold">{nome}</h2>
                        {/* se for negativo vermelho e se positivo verde */}
                        <p className={`font-bold text-end ${total < 0 ? "text-red-600" : "text-green-600"}`}>
                            R$ {total.toFixed(2)}
                        </p>
                    </div>
                ))}
                <div key='qtd-nao-classificado' className="rounded-xl border p-4 shadow">
                    <h2 className="text-lg font-semibold">Qtd não classificado</h2>
                    {/* se for negativo vermelho e se positivo verde */}
                    <p className={`font-bold text-end text-red-600`}>
                        {dados.filter(e => !e.lancamento?.classificacao).length}
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Detalhamento</h2>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Data</th>
                                <th className="p-2">Descrição</th>
                                <th className="p-2">Valor</th>
                                <th className="p-2">Classificação</th>
                                <th className="p-2">Origem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map(e => (
                                <tr key={e.id} className="border-t">
                                    <td className="p-2">{new Date(e.data).toLocaleDateString()}</td>
                                    <td className="p-2 w-0 max-w-xs truncate" title={e.descricao}>{e.descricao}</td>
                                    <td className={`p-2 ${e.valor < 0 ? "text-red-600" : "text-green-700"}`}>
                                        R$ {e.valor.toFixed(2)}
                                    </td>
                                    <td className="p-2">
                                        {e.lancamento?.classificacao?.nome || <span className="text-gray-400">Não classificado</span>}
                                    </td>
                                    <td className="p-2">{e.origem}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

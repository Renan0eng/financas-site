"use client"

import { ChartGastosReceitas } from "@/components/charts/chart-gastos-receitas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Prisma } from "@prisma/client"
import { useEffect, useMemo, useState } from "react"



type LancamentoWithClassificacao = Prisma.LancamentoGetPayload<{
    include: { classificacao: true }
}>

export default function AnaliseEsteira() {
    const [dados, setDados] = useState<LancamentoWithClassificacao[]>([])
    const [resumo, setResumo] = useState<Record<string, number>>({})
    const [analiseMensal, setAnaliseMensal] = useState<any[]>([])

    const [meses, setMeses] = useState<number>(1)

    const dadosTransformados = useMemo(() => {
        const hoje = new Date()
        const diasTotal = meses * 30
        const dataInicio = new Date()
        dataInicio.setDate(hoje.getDate() - diasTotal)

        const mapa: Record<string, { dia: string; receitas: number; gastos: number }> = {}

        // Preenche todos os dias no intervalo com 0
        for (let i = 0; i <= diasTotal; i++) {
            const d = new Date(dataInicio)
            d.setDate(d.getDate() + i)
            const dia = d.toISOString().split("T")[0]
            mapa[dia] = { dia, receitas: 0, gastos: 0 }
        }

        // Soma os dados reais
        for (const item of dados) {
            const dataItem = new Date(item.data)
            if (dataItem < dataInicio || dataItem > hoje) continue

            const dia = dataItem.toISOString().split("T")[0]
            if (!mapa[dia]) continue

            if (item.valor >= 0) {
                mapa[dia].receitas += item.valor
            } else {
                mapa[dia].gastos += Math.abs(item.valor)
            }
        }

        return Object.values(mapa)
    }, [dados, meses])

    const dadosTransformadosAgregados = useMemo(() => {
        const hoje = new Date()
        const diasTotal = meses * 30
        const dataInicio = new Date()
        dataInicio.setDate(hoje.getDate() - diasTotal)

        const mapa: Record<string, { dia: string; receitas: number; gastos: number }> = {}

        // Preenche todos os dias no intervalo com 0
        for (let i = 0; i <= diasTotal; i++) {
            const d = new Date(dataInicio)
            d.setDate(d.getDate() + i)
            const dia = d.toISOString().split("T")[0]
            mapa[dia] = { dia, receitas: 0, gastos: 0 }
        }

        // Agrega os dados por dia
        const acumulado: { dia: string; receitas: number; gastos: number; saldo: number }[] = []
        let receitasAcum = 0
        let gastosAcum = 0

        // Soma os dados reais
        for (const item of dados) {
            const dataItem = new Date(item.data)
            if (dataItem < dataInicio || dataItem > hoje) continue

            const dia = dataItem.toISOString().split("T")[0]
            if (!mapa[dia]) continue

            if (item.valor >= 0) {
                mapa[dia].receitas += item.valor
            } else {
                mapa[dia].gastos += Math.abs(item.valor)
            }
        }

        return Object.values(mapa)
    }, [dadosTransformados])


    const getData = async () => {
        fetch(`/api/analise/lancamento?meses=${meses}`)
            .then((res) => res.json())
            .then((data: LancamentoWithClassificacao[]) => {
                setDados(data)

                const agrupar: Record<string, number> = {}
                console.log("Dados recebidos:", data);

                data.forEach((e) => {
                    const nome = e.classificacao?.nome || "Não classificado"
                    agrupar[nome] = (agrupar[nome] || 0) + e.valor
                })
                setResumo(agrupar)

                const mensalMap = new Map<
                    string,
                    {
                        mes: string
                        patrimonio: number
                        rendaPassiva: number
                        salario: number
                        gastos: number
                    }
                >()

                let patrimonioAcumulado = 0

                data
                    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                    .forEach((e) => {
                        const date = new Date(e.data)
                        const mes = `${date.getFullYear()}-${(date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}`

                        const nome = e.classificacao?.nome?.toLowerCase() ||
                            "não classificado"
                        const valor = e.valor

                        if (!mensalMap.has(mes)) {
                            mensalMap.set(mes, {
                                mes,
                                patrimonio: 0,
                                rendaPassiva: 0,
                                salario: 0,
                                gastos: 0,
                            })
                        }

                        const item = mensalMap.get(mes)!
                        patrimonioAcumulado += valor
                        item.patrimonio = patrimonioAcumulado

                        if (nome.includes("renda passiva")) item.rendaPassiva += valor
                        else if (nome.includes("salário") || nome.includes("salario"))
                            item.salario += valor
                        else if (valor < 0) item.gastos += valor
                    })

                setAnaliseMensal(Array.from(mensalMap.values()))
            })
    }

    useEffect(() => {
        getData()
    }, [meses])


    return (
        <div className="p-6 space-y-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Análise de Lançamento</h1>
                {/* ultimo mes / ultimos 3 messes select */}
                <Select value={meses.toString()} onValueChange={(v) => setMeses(Number(v))}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Último Mês</SelectItem>
                        <SelectItem value="3">Últimos 3 Meses</SelectItem>
                        <SelectItem value="6">Últimos 6 Meses</SelectItem>
                        <SelectItem value="12">Últimos 12 Meses</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div key="total" className={`rounded-xl border p-4 shadow ${dados.reduce((acc, e) => acc + e.valor, 0) < 0 ? "bg-red-100" : "bg-green-100"}`}>
                    <h2 className="text-lg font-semibold">Total</h2>
                    <p className={`font-bold text-end ${dados.reduce((acc, e) => acc + e.valor, 0) < 0 ? "text-red-600" : "text-green-600"}`}>
                        R$ {dados.reduce((acc, e) => acc + e.valor, 0).toFixed(2)}
                    </p>
                </div>

                {Object.entries(resumo).map(([nome, total]) => (
                    <div key={nome} className="rounded-xl border p-4 shadow">
                        <h2 className="text-lg font-semibold">{nome}</h2>
                        <p
                            className={`font-bold ${total < 0 ? "text-red-600" : "text-green-600"
                                }`}
                        >
                            R$ {total.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
            <Separator />
            <div>
                {/* grafico duplo por dias com gastos e receitas */}
                <ChartGastosReceitas
                    titulo="Gastos e Receitas"
                    data={dadosTransformados}
                />
                <ChartGastosReceitas
                    titulo="Gastos e Receitas Acumulados"
                    data={dadosTransformadosAgregados}
                />
            </div>
        </div>
    )
}
"use client"

import SelectClassificacao from "@/components/select-classificacao"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatarDataBr } from "@/lib/utils"
import { Esteira } from "@prisma/client"
import { Upload } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EsteiraPage() {
    const [lancamentos, setLancamentos] = useState<Esteira[]>([])
    const [selecionado, setSelecionado] = useState<Esteira | null>(null)
    const [classificacao, setClassificacao] = useState("")
    const [recorrente, setRecorrente] = useState(false)
    const [warn, setWarn] = useState(false)
    const [warnDesc, setWarnDesc] = useState("")

    async function buscarEsteira() {
        const res = await fetch("/api/esteira")
        if (!res.ok) {
            console.error("Erro ao buscar esteira:", res.statusText);
            return;
        }
        const data = await res.json()
        setLancamentos(data)
    }

    async function enviarClassificacao() {
        if (!selecionado) return
        await fetch("/api/lancamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...selecionado,
                classificacao,
                recorrente,
                warn,
                warnDesc,
            })
        })
        limparSelecao()
        buscarEsteira()
    }

    useEffect(() => {
        buscarEsteira()
    }, [])

    const limparSelecao = () => {
        setSelecionado(null)
        setClassificacao("")
        setRecorrente(false)
        setWarn(false)
        setWarnDesc("")
    }

    return (
        <main className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Esteira de Importações</h1>
                <Link href="/importar">
                    <Button><Upload className="mr-2" /> Importar</Button>
                </Link>
            </div>

            <div className="overflow-x-auto">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Descrição</th>
                                <th className="p-2">Data</th>
                                <th className="p-2">Valor</th>
                                <th className="p-2 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lancamentos.map(l => (
                                <tr key={l.id} className="border-t">
                                    <td className="p-2 w-0 max-w-sm truncate" title={l.descricao}>{l.descricao}</td>
                                    <td className="p-2">{formatarDataBr(l.data)}</td>
                                    <td className={`p-2 font-bold text-right ${l.valor < 0 ? "text-red-600" : "text-green-600"}`}>
                                        R$ {l.valor.toFixed(2)}
                                    </td>
                                    <td className="p-2 flex justify-center">
                                        {!l.classificado && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button onClick={() => setSelecionado(l)} size="sm">Classificar</Button>
                                                </DialogTrigger>
                                                {selecionado && <DialogContent className="space-y-4" onCloseAutoFocus={limparSelecao}>
                                                    <DialogTitle>Classificar Lançamento</DialogTitle>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <Label className="font-semibold">Descrição:</Label>
                                                            <Label className="font-normal">{selecionado?.descricao}</Label>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <Label className="font-semibold">Data:</Label>
                                                                <Label className="font-normal">{formatarDataBr(selecionado?.data)}</Label>
                                                            </div>
                                                            <div>
                                                                <Label className="font-semibold">Valor:</Label>
                                                                <Label className={`font-normal ${selecionado?.valor < 0 ? "text-red-600" : "text-green-600"}`}>
                                                                    R$ {selecionado?.valor.toFixed(2)}
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <SelectClassificacao
                                                        value={classificacao}
                                                        onChange={setClassificacao}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox id="recorrente" checked={recorrente} onCheckedChange={() => setRecorrente(!recorrente)} />
                                                        <Label htmlFor="recorrente">Recorrente</Label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox id="warn" checked={warn} onCheckedChange={() => setWarn(!warn)} />
                                                        <Label htmlFor="warn">Destacar</Label>
                                                    </div>
                                                    {warn && <div className="space-y-2">
                                                        <Label>Descrição do destaque</Label>
                                                        <Input value={warnDesc} onChange={e => setWarnDesc(e.target.value)} placeholder="Motivo do destaque" />
                                                    </div>}
                                                    <Button onClick={enviarClassificacao}>Enviar</Button>
                                                </DialogContent>}
                                            </Dialog>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

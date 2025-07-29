"use client"

import SelectClassificacao from "@/components/select-classificacao"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
                <h1 className="text-2xl font-bold mb-4">Esteira de Importações</h1>
                <Link href="/importar" className="text-blue-600 hover:underline ">
                    <Button> <Upload /> Importar </Button>
                </Link>
            </div>
            <div className="grid gap-4">
                {lancamentos.map(l => (
                    <Card key={l.id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{l.descricao}</p>
                                <p className="text-sm text-gray-500">{formatarDataBr(l.data)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className={`font-bold ${l.valor < 0 ? "text-red-600" : "text-green-600"}`}>
                                    R$ {l.valor.toFixed(2)}
                                </p>
                                {!l.classificado && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button onClick={() => setSelecionado(l)} size="sm">Classificar</Button>
                                        </DialogTrigger>
                                        {selecionado && <DialogContent className="space-y-4" onCloseAutoFocus={(e) => limparSelecao()}>
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
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    )
}

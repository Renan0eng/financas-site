"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Prisma } from "@prisma/client"
import { List, MoreVertical, Upload } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type LancamentoWithClassificacao = Prisma.LancamentoGetPayload<{
    include: { classificacao: true }
}>

export default function Home() {
    const [esteira, setEsteira] = useState<LancamentoWithClassificacao[]>([])
    const [selecionado, setSelecionado] = useState<LancamentoWithClassificacao | null>(null)
    const [open, setOpen] = useState(false)

    const buscarEsteira = async () => {
        const res = await fetch("/api/lancamento")
        const data = await res.json()
        setEsteira(data)
    }

    useEffect(() => {
        buscarEsteira()
    }, [])

    const salvarEdicao = async () => {
        if (!selecionado) return

        await fetch(`/api/lancamento/${selecionado.id}`, {
            method: "PUT",
            body: JSON.stringify({
                descricao: selecionado.descricao,
                valor: selecionado.valor,
                origem: selecionado.origem
            }),
            headers: { "Content-Type": "application/json" }
        })

        setOpen(false)
        buscarEsteira()
    }

    return (
        <main className="p-6 mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Lançamentos Importados</h1>
                <div className="flex items-center space-x-4">
                    <Link href="/esteira">
                        <Button><List className="mr-2" /> Esteira</Button>
                    </Link>
                    <Link href="/importar">
                        <Button><Upload className="mr-2" /> Importar</Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full table-auto text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Data</th>
                                <th className="p-2">Descrição</th>
                                <th className="p-2">Valor</th>
                                <th className="p-2">Classificação</th>
                                <th className="p-2">Origem</th>
                                <th className="p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {esteira.map(l => (
                                <tr key={l.id} className="border-t">
                                    <td className="p-2">{new Date(l.data).toLocaleDateString("pt-BR")}</td>
                                    <td className="p-2 w-0 max-w-xs truncate" title={l.descricao}>{l.descricao}</td>
                                    <td className={`p-2 font-bold ${l.valor < 0 ? "text-red-600" : "text-green-600"}`}>
                                        R$ {l.valor.toFixed(2)}
                                    </td>
                                    <td className="p-2">{l.classificacao?.nome || <span className="text-gray-400">Não classificado</span>}</td>
                                    <td className="p-2">{l.origem}</td>
                                    <td className="p-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelecionado(l)
                                                        setOpen(true)
                                                    }}
                                                >
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (window.confirm("Deseja excluir este lançamento?")) {
                                                            fetch(`/api/lancamento/${l.id}`, { method: "DELETE" }).then(buscarEsteira)
                                                        }
                                                    }}
                                                    className="text-red-600"
                                                >
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar lançamento</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Descrição</Label>
                            <Input
                                value={selecionado?.descricao || ""}
                                onChange={(e) => setSelecionado((prev) => prev && { ...prev, descricao: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Valor</Label>
                            <Input
                                type="number"
                                value={selecionado?.valor || 0}
                                onChange={(e) => setSelecionado((prev) => prev && { ...prev, valor: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Origem</Label>
                            <Input
                                value={selecionado?.origem || ""}
                                onChange={(e) => setSelecionado((prev) => prev && { ...prev, origem: e.target.value })}
                            />
                        </div>

                        <Button onClick={salvarEdicao}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    )
}

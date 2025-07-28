"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { List, MoreVertical, Upload } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Esteira = {
    id: string
    data: string
    valor: number
    descricao: string
    origem: string
}

export default function Home() {
    const [esteira, setEsteira] = useState<Esteira[]>([])
    const [selecionado, setSelecionado] = useState<Esteira | null>(null)
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

        await fetch(`/api/esteira/${selecionado.id}`, {
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
                    <Link href="/esteira" className="text-blue-600 hover:underline ">
                        <Button> <List /> Esteira </Button>
                    </Link>
                    <Link href="/importar" className="text-blue-600 hover:underline ">
                        <Button> <Upload /> Importar </Button>
                    </Link>
                </div>
            </div>

            {esteira.map((l) => (
                <Card key={l.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text- font-medium">
                            {new Date(l.data).toLocaleDateString("pt-BR")} - {l.origem}
                        </CardTitle>

                        <div className="flex items-center gap-4">
                            <p className={`font-bold ${l.valor < 0 ? "text-red-600" : "text-green-600"}`}>
                                R$ {l.valor.toFixed(2)}
                            </p>

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
                                                fetch(`/api/esteira/${l.id}`, { method: "DELETE" }).then(buscarEsteira)
                                            }
                                        }}
                                        className="text-red-600"
                                    >
                                        Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <p className="text-muted-foreground">{l.descricao}</p>
                    </CardContent>
                </Card>
            ))}

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

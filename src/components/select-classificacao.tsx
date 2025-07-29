"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { useEffect, useState } from "react"

type Classificacao = {
    id: string
    nome: string
}

type Props = {
    value?: string
    onChange: (id: string) => void
}

export default function SelectClassificacao({ value, onChange }: Props) {
    const [classificacoes, setClassificacoes] = useState<Classificacao[]>([])
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")

    async function carregar() {
        const res = await fetch("/api/classificacoes")
        const data = await res.json()
        setClassificacoes(data)
    }

    async function criarClassificacao(nome: string) {
        const res = await fetch("/api/classificacoes", {
            method: "POST",
            body: JSON.stringify({ nome }),
            headers: { "Content-Type": "application/json" },
        })
        const nova = await res.json()
        setClassificacoes((prev) => [...prev, nova])
        onChange(nova.id)
        setOpen(false)
        setInput("")
    }

    useEffect(() => {
        carregar()
    }, [])

    const selecionada = classificacoes.find((c) => c.id === value)

    return (
        <div className="space-y-2">
            <Label>Classificação</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selecionada ? selecionada.nome : "Selecione ou crie uma classificação"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <div className="flex items-center px-2 py-2 gap-2">
                            <CommandInput
                                placeholder="Nova ou existente..."
                                value={input}
                                onValueChange={setInput}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => criarClassificacao(input)}
                                disabled={!input.trim()}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <CommandEmpty>Nenhuma classificação</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                            {classificacoes.map((c) => (
                                <CommandItem
                                    key={c.id}
                                    value={c.nome}
                                    onSelect={() => {
                                        onChange(c.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", c.id === value ? "opacity-100" : "opacity-0")} />
                                    {c.nome}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
} from "recharts"

import type { ChartConfig } from "@/components/ui/chart"

const chartConfig: ChartConfig = {
    receitas: {
        label: "Receitas",
        color: "var(--color-green-500)",
    },
    gastos: {
        label: "Gastos",
        color: "var(--color-red-500)",
    },
}

type Props = {
    titulo: string
    data: { dia: string; receitas: number; gastos: number }[]
}

export function ChartGastosReceitas({ titulo, data }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{titulo}</CardTitle>
                <CardDescription>Resumo financeiro diário</CardDescription>
            </CardHeader>
            <CardContent >
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="dia"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(5)} // mostra só "MM-DD"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="receitas"
                            type="monotone"
                            stroke="var(--color-green-500)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="gastos"
                            type="monotone"
                            stroke="var(--color-red-500)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Comparativo diário <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Agrupado por data
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

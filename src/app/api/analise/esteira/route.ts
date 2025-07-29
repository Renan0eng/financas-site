import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const dados = await prisma.esteira.findMany({
        include: {
            lancamento: {
                include: {
                    classificacao: true,
                },
            },
        },
    })

    return NextResponse.json(dados)
}

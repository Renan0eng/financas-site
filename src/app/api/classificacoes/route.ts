
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const classificacoes = await prisma.classificacao.findMany({
            include: {
                _count: {
                    select: { lancamentos: true },
                },
            },
            orderBy: {
                lancamentos: {
                    _count: 'desc',
                },
            },
        })


        return NextResponse.json(classificacoes)
    } catch (err) {
        console.error(err)
        return new NextResponse("Erro ao buscar classificações", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nome } = body

        if (!nome) {
            return new NextResponse("Nome é obrigatório", { status: 400 })
        }

        const classificacao = await prisma.classificacao.create({
            data: { nome },
        })

        return NextResponse.json(classificacao)
    } catch (err) {
        console.error(err)
        return new NextResponse("Erro ao criar classificação", { status: 500 })
    }
}

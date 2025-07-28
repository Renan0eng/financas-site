
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const classificacoes = await prisma.classificacao.findMany({
            orderBy: { nome: "asc" },
        })

        return NextResponse.json(classificacoes)
    } catch (err) {
        console.error(err)
        return new NextResponse("Erro ao buscar classificações", { status: 500 })
    }
}

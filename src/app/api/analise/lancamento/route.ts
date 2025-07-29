import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const meses = parseInt(req.nextUrl.searchParams.get('meses') || '1', 10)

    const data = await prisma.lancamento.findMany({
        where: {
            data: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - meses)),
            },
        },
        include: {
            classificacao: true,
        },
        orderBy: {
            data: 'desc',
        },
    })

    return NextResponse.json(data)
}
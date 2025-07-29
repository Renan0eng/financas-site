import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data, valor, descricao, origem, recorrente,classificacao, warn, warnDesc, id, idBanco } = body

        const lancamento = await prisma.lancamento.create({
            data: {
                data: new Date(data),
                valor,
                descricao,
                origem,
                idBanco,
                classificacaoId: classificacao,
                recorrente: recorrente || false,
                destaque: warn || false,
                destaqueDescricao: warnDesc || null,
            },
        })

        const esteira = await prisma.esteira.update({
            where: { id: id },
            data: { 
                classificado: true,
                lancamentoId: lancamento.id
            },
        })

        return NextResponse.json(lancamento)
    } catch (err) {
        console.error(err)
        return new NextResponse("Erro ao criar lançamento", { status: 500 })
    }
}

export async function GET() {
  const lancamentos = await prisma.lancamento.findMany({
    orderBy: { data: 'desc' },
    include: {
      classificacao: true,
      esteira: true,
    },
  })

  return NextResponse.json(lancamentos)
}
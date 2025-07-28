import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data, valor, descricao, origem, recorrente,classificacao, warn, warnDesc, id } = body

        console.log("body:", body);

        const lancamento = await prisma.lancamento.create({
            data: {
                data: new Date(data),
                valor,
                descricao,
                origem,
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.lancamento.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  await prisma.lancamento.update({
    where: { id: params.id },
    data: {
      descricao: body.descricao,
      valor: body.valor,
      origem: body.origem
    }
  })
  return NextResponse.json({ ok: true })
}
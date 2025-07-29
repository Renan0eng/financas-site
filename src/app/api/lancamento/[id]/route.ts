import prisma from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

type Context = {
  params: { id: string }
}

export async function DELETE(_: NextRequest, { params }: Context) {
  await prisma.lancamento.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: NextRequest, { params }: Context) {
  const body = await req.json()
  await prisma.lancamento.update({
    where: { id: params.id },
    data: {
      descricao: body.descricao,
      valor: body.valor,
      origem: body.origem,
    },
  })
  return NextResponse.json({ ok: true })
}

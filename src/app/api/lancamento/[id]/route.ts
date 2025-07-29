import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.lancamento.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  console.log("Atualizando lançamento:", params.id, body);
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
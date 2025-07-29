import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()! 
  const body = await req.json()

  await prisma.lancamento.update({
    where: { id },
    data: {
      descricao: body.descricao,
      valor: body.valor,
      origem: body.origem,
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split("/").pop()!

  await prisma.lancamento.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

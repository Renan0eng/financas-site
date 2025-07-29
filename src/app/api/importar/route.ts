// app/api/importar/route.ts
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const esteira = body.lancamentos as {
    data: string
    valor: number
    descricao: string
    idBanco: string
  }[]

  console.log(`Importando ${esteira.length} lançamentos...`);
  
  const result = await prisma.esteira.createMany({
    data: esteira.map((l) => ({
      data: new Date(l.data.split("/").reverse().join("-")),
      valor: l.valor,
      descricao: l.descricao,
      origem: "nubank",
      idBanco: l.idBanco,
    })),
    skipDuplicates: true,
  })

  return NextResponse.json({ inseridos: result.count })
}

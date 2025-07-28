import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const dados = await prisma.esteira.findMany({
    where: { classificado: false },
    orderBy: { data: "desc" },
  })

  return NextResponse.json(dados)
}

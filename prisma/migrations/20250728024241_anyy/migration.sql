-- AlterTable
ALTER TABLE "Lancamento" ADD COLUMN     "classificacaoId" TEXT,
ADD COLUMN     "destaque" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "destaqueDescricao" TEXT,
ADD COLUMN     "recorrente" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Esteira" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "classificado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Esteira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classificacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classificacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lancamento" ADD CONSTRAINT "Lancamento_classificacaoId_fkey" FOREIGN KEY ("classificacaoId") REFERENCES "Classificacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

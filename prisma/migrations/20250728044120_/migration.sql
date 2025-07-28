/*
  Warnings:

  - You are about to drop the column `classificado` on the `Lancamento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lancamentoId]` on the table `Esteira` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Esteira" ADD COLUMN     "lancamentoId" TEXT;

-- AlterTable
ALTER TABLE "Lancamento" DROP COLUMN "classificado";

-- CreateIndex
CREATE UNIQUE INDEX "Esteira_lancamentoId_key" ON "Esteira"("lancamentoId");

-- AddForeignKey
ALTER TABLE "Esteira" ADD CONSTRAINT "Esteira_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "Lancamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

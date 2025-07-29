/*
  Warnings:

  - A unique constraint covering the columns `[idBanco]` on the table `Esteira` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idBanco]` on the table `Lancamento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idBanco` to the `Esteira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idBanco` to the `Lancamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Esteira" ADD COLUMN     "idBanco" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lancamento" ADD COLUMN     "idBanco" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Esteira_idBanco_key" ON "Esteira"("idBanco");

-- CreateIndex
CREATE UNIQUE INDEX "Lancamento_idBanco_key" ON "Lancamento"("idBanco");

-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "liga" TEXT NOT NULL
);




-- CreateTable
CREATE TABLE "Personagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "posicao" TEXT NOT NULL,
    "habilidade" TEXT NOT NULL
  
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "cargo" TEXT NOT NULL ,
    "cpf" TEXT NOT NULL UNIQUE,
    "senha" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_senha_key"
ON "Funcionario"("senha");

CREATE UNIQUE INDEX "Funcionario_email_key"
ON "Funcionario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Time_nome_key" ON "Time"("nome");

-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "liga" TEXT NOT NULL
);

CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);


-- CreateTable
CREATE TABLE "Personagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "posicao" TEXT NOT NULL,
    "habilidade" TEXT NOT NULL,
    "timeId" INTEGER NOT NULL,
    CONSTRAINT "Personagem_timeId_fkey"
        FOREIGN KEY ("timeId")
        REFERENCES "Time" ("id")
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key"
ON "Usuario"("cpf");

CREATE UNIQUE INDEX "Usuario_email_key"
ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Time_nome_key" ON "Time"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_cpf_key" ON "Funcionario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");
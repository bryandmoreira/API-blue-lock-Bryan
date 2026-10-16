import { Router } from "express";
import { prisma } from "../config/prisma"; // use o mesmo caminho do prisma que você usou no seu seed
import bcrypt from "bcrypt";

const routes = Router();

// Adicione essa função para rodar direto de dentro do servidor ligado:
async function criarAdminNoBancoDoServidor() {
  try {
    const adminExiste = await prisma.funcionario.findUnique({
      where: { email: "admin@gmail.com" }
    });

    if (!adminExiste) {
      await prisma.funcionario.create({
        data: {
          nome: "Admin",
          email: "admin@gmail.com",
          cargo: "ADMIN",
          cpf: "12345678912",
          senha: bcrypt.hashSync("123456", 10), 
        }
      });
      console.log("✅ [SERVIDOR] admin@gmail.com criado com sucesso no banco ativo!");
    }
  } catch (error) {
    console.error("Erro ao criar admin automático:", error);
  }
}

// Executa a função na hora
criarAdminNoBancoDoServidor();

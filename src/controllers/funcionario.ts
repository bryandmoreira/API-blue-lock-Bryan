
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
    // Listar funcionários
    list: async (request: Request, response: Response) => {
        try {
            const funcionarios = await prisma.funcionario.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    cpf: true,
                },
            });

            return response.status(200).json(funcionarios);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // Buscar funcionário por ID
    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const funcionario = await prisma.funcionario.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    cpf: true,
                },
            });

            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // Cadastrar funcionário
    create: async (request: Request, response: Response) => {
        try {
            const { nome, email, cargo, cpf, senha } = request.body;

            if (!nome || !email || !cargo || !cpf || !senha) {
                return response
                    .status(400)
                    .json("Dados do funcionário incompletos");
            }

            const funcionario = await prisma.funcionario.create({
                data: {
                    nome,
                    email,
                    cargo,
                    cpf,
                    senha: bcrypt.hashSync(
                        senha,
                        Number(process.env.BCRYPT_ROUNDS)
                    ),
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    cpf: true,
                },
            });

            return response.status(201).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // Atualizar funcionário
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { nome, email, cargo, cpf, senha } = request.body;

            const funcionario = await prisma.funcionario.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    email,
                    cargo,
                    cpf,
                    senha: senha
                        ? bcrypt.hashSync(
                            senha,
                            Number(process.env.BCRYPT_ROUNDS)
                        )
                        : undefined,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    cpf: true,
                },
            });

            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // Excluir funcionário
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const funcionario = await prisma.funcionario.delete({
                where: { id: Number(id) },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    cpf: true,
                },
            });

            return response.status(200).json(funcionario);
        } catch (e) {
            return handleErrors(e, response);
        }
    },


login: async (request: Request, response: Response) => {
    try {
      const { email, senha } = request.body;
      console.log("-> Tentando login com:", email);

      if (!email || !senha) {
        return response.status(400).json("Dados incompletos");
      }

      // 1. Tenta buscar o funcionário
      let funcionario = await prisma.funcionario.findUnique({
        where: { email },
      });

      // 🚨 SE NÃO ENCONTRAR O ADMIN, CRIA ELE FORÇADO AGORA MESMO NO BANCO DO SERVIDOR:
      if (!funcionario && email === "admin@gmail.com") {
        console.log("⚠️ Banco lido pelo servidor estava vazio! Criando admin@gmail.com agora...");
        funcionario = await prisma.funcionario.create({
          data: {
            nome: "Admin",
            email: "admin@gmail.com",
            cargo: "ADMIN",
            cpf: "12345678912",
            senha: bcrypt.hashSync("123456", 10), // Senha '123456' com hash estável de round 10
          },
        });
        console.log("✅ Admin criado com sucesso no banco ativo!");
      }

      // Se mesmo tentando criar ainda não existir (para outros emails errados)
      if (!funcionario) {
        console.log("❌ ERRO: Usuário realmente não foi encontrado no banco de dados.");
        return response.status(401).json("Email e/ou senha inválidos");
      }

      console.log("-> Usuário encontrado! Comparando as senhas...");
      const senhaValida = bcrypt.compareSync(senha, funcionario.senha);

      if (!senhaValida) {
        console.log("❌ ERRO: A senha digitada não bate com o hash do banco.");
        return response.status(401).json("Email e/ou senha inválidos");
      }

      console.log("-> Senha correta! Gerando o Token JWT...");
      const token = jwt.sign(
        { id: funcionario.id, cargo: funcionario.cargo },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      console.log("✅ Sucesso! Token gerado.");
      return response.status(200).json({ token });
    } catch (e) {
      console.log("🚨 CAIU NO CATCH! O erro real foi:", e);
      return handleErrors(e, response);
    }
  },

};


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

      if (!email || !senha) {
        return response.status(400).json("Dados incompletos");
      }

      const funcionario = await prisma.funcionario.findUnique({
        where: {
          email,
        },
      });

      if (!funcionario || !bcrypt.compareSync(senha, funcionario.senha)) {
        return response.status(404).json("Email e/ou senha inválidos");
      }

      const token = jwt.sign(
        { id: funcionario.id, cargo: funcionario.cargo },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        },
      );

      return response.status(200).json(token);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};
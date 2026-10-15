import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
    list: async (_request: Request, response: Response) => {
        try {
            const funcionarios = await prisma.funcionario.findMany();
            return response.status(200).json(funcionarios);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    getById: async (request: Request, response: Response) => {
        try {
            const funcionario = await prisma.funcionario.findUnique({
                where: { id: Number(request.params.id) },
            });
            if (!funcionario) {
                return response.status(404).json({ message: "Funcionário não encontrado." });
            }
            return response.status(200).json(funcionario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { nome, idade, cpf, email, cargo, descricao } = request.body;
            if (
                typeof nome !== "string" || !nome.trim() ||
                !Number.isInteger(idade) || idade < 0 ||
                typeof cpf !== "string" || !cpf.trim() ||
                typeof email !== "string" || !email.trim() ||
                typeof cargo !== "string" || !cargo.trim() ||
                typeof descricao !== "string" || !descricao.trim()
            ) {
                return response.status(400).json({ message: "Dados do funcionário incompletos ou inválidos." });
            }
            const funcionario = await prisma.funcionario.create({
                data: {
                    nome: nome.trim(),
                    idade,
                    cpf: cpf.trim(),
                    email: email.trim().toLowerCase(),
                    cargo: cargo.trim(),
                    descricao: descricao.trim(),
                },
            });
            return response.status(201).json(funcionario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const { nome, idade, cpf, email, cargo, descricao } = request.body;
            const funcionario = await prisma.funcionario.update({
                where: { id: Number(request.params.id) },
                data: {
                    ...(nome !== undefined && { nome }),
                    ...(idade !== undefined && { idade }),
                    ...(cpf !== undefined && { cpf }),
                    ...(email !== undefined && { email }),
                    ...(cargo !== undefined && { cargo }),
                    ...(descricao !== undefined && { descricao }),
                },
            });
            return response.status(200).json(funcionario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    delete: async (request: Request, response: Response) => {
        try {
            const funcionario = await prisma.funcionario.delete({
                where: { id: Number(request.params.id) },
            });
            return response.status(200).json(funcionario);
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};
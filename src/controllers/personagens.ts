import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
    list: async (request: Request, response: Response) => {
        try {
            const personagens = await prisma.personagem.findMany();

            return response.status(200).json(personagens);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const personagem = await prisma.personagem.findUnique({
                where: {
                    id: +id,
                },
            });

            return response.status(200).json(personagem);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { nome, idade, posicao, habilidade,} = request.body;

            if (!nome || idade === undefined || !posicao || !habilidade) {
                return response.status(400).json("Dados do personagem incompletos");
            }

            const personagem = await prisma.personagem.create({
                data: {
                    nome,
                    idade: +idade,
                    posicao,
                    habilidade,
                },
            });

            return response.status(201).json(personagem);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const { nome, idade, posicao, habilidade,} = request.body;

            const personagem = await prisma.personagem.update({
                where: {
                    id: +id,
                },
                data: {
                    nome,
                    idade: idade !== undefined ? +idade : undefined,
                    posicao,
                    habilidade,
                },
            });

            return response.status(200).json(personagem);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const personagem = await prisma.personagem.delete({
                where: {
                    id: +id,
                },
            });

            return response.status(200).json(personagem);
        } catch (e) {
            return handleErrors(e, response);
        }
    },
};
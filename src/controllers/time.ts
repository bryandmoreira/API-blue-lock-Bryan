import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
    list: async (_request: Request, response: Response) => {
        try {
            const times = await prisma.time.findMany();
            return response.status(200).json(times);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    getById: async (request: Request, response: Response) => {
        try {
            const time = await prisma.time.findUnique({
                where: { id: Number(request.params.id) },
                include: { personagens: true },
            });
            if (!time) {
                return response.status(404).json({ message: "Time não encontrado." });
            }
            return response.status(200).json(time);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { nome, pais, tecnico, liga } = request.body;
            if ([nome, pais, tecnico, liga].some((value) => typeof value !== "string" || !value.trim())) {
                return response.status(400).json({ message: "Informe nome, país, técnico e liga." });
            }
            const time = await prisma.time.create({
                data: {
                    nome: nome.trim(),
                    pais: pais.trim(),
                    tecnico: tecnico.trim(),
                    liga: liga.trim(),
                },
            });
            return response.status(201).json(time);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    update: async (request: Request, response: Response) => {
        try {
            const { nome, pais, tecnico, liga } = request.body;
            const time = await prisma.time.update({
                where: { id: Number(request.params.id) },
                data: {
                    ...(nome !== undefined && { nome }),
                    ...(pais !== undefined && { pais }),
                    ...(tecnico !== undefined && { tecnico }),
                    ...(liga !== undefined && { liga }),
                },
            });
            return response.status(200).json(time);
        } catch (error) {
            return handleErrors(error, response);
        }
    },

    delete: async (request: Request, response: Response) => {
        try {
            const time = await prisma.time.delete({
                where: { id: Number(request.params.id) },
            });
            return response.status(200).json(time);
        } catch (error) {
            return handleErrors(error, response);
        }
    },
};
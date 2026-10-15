import { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { AuthenticatedUser } from "./authentication";

function getUser(response: Response): AuthenticatedUser | undefined {
    const user: unknown = response.locals.user;
    if (
        typeof user === "object" &&
        user !== null &&
        "id" in user &&
        typeof user.id === "number" &&
        Number.isInteger(user.id) &&
        "email" in user &&
        typeof user.email === "string"
    ) {
        return { id: user.id, email: user.email };
    }
    return undefined;
}

export async function isAdmin(_request: Request, response: Response, next: NextFunction) {
    const user = getUser(response);
    if (!user) {
        return response.status(401).json({ message: "Autenticação necessária." });
    }

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { email: user.email },
            select: { cargo: true },
        });
        if (funcionario?.cargo !== "ADMIN") {
            return response.status(403).json({ message: "Acesso restrito a administradores." });
        }
        return next();
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Não foi possível verificar as permissões." });
    }
}

export async function isAdminOrHimself(request: Request, response: Response, next: NextFunction) {
    const user = getUser(response);
    if (!user) {
        return response.status(401).json({ message: "Autenticação necessária." });
    }

    const id = Number(request.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return response.status(400).json({ message: "ID de funcionário inválido." });
    }

    try {
        const solicitante = await prisma.funcionario.findUnique({
            where: { email: user.email },
            select: { id: true, cargo: true },
        });
        if (
            solicitante?.id === id &&
            solicitante.cargo !== "ADMIN" &&
            request.body?.cargo !== undefined
        ) {
            return response.status(403).json({ message: "Somente administradores podem alterar cargos." });
        }
        if (solicitante?.id === id || solicitante?.cargo === "ADMIN") {
            return next();
        }
        return response.status(403).json({ message: "Acesso não autorizado." });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Não foi possível verificar as permissões." });
    }
}

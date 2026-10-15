import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET must be configured");
    }
    return secret;
}

export default {
    login: async (request: Request, response: Response) => {
        try {
            const { email, senha } = request.body;
            if (typeof email !== "string" || typeof senha !== "string") {
                return response.status(400).json({ message: "Informe e-mail e senha." });
            }

            const usuario = await prisma.usuario.findUnique({
                where: { email: email.trim().toLowerCase() },
            });
            if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
                return response.status(401).json({ message: "E-mail ou senha inválidos." });
            }

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                getJwtSecret(),
                { expiresIn: "1h" },
            );

            return response.status(200).json({
                token,
                usuario: {
                    id: usuario.id,
                    email: usuario.email,
                },
            });
        } catch (e) {
            if (e instanceof Error && e.message === "JWT_SECRET must be configured") {
                console.error(e);
                return response.status(500).json({ message: "Autenticação não está configurada." });
            }
            return handleErrors(e, response);
        }
    },
};

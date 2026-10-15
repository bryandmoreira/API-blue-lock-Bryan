import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type AuthenticatedUser = {
    id: number;
    email: string;
};

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET must be configured");
    }
    return secret;
}

export function authentication(request: Request, response: Response, next: NextFunction) {
    const authorization = request.get("authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return response.status(401).json({ message: "Token de autenticação ausente." });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "number" ||
            !Number.isInteger(decoded.id) ||
            typeof decoded.email !== "string"
        ) {
            return response.status(401).json({ message: "Token de autenticação inválido." });
        }

        response.locals.user = {
            id: decoded.id,
            email: decoded.email,
        } satisfies AuthenticatedUser;
        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return response.status(401).json({ message: "Token inválido ou expirado." });
        }
        console.error(error);
        return response.status(500).json({ message: "Falha na configuração da autenticação." });
    }
}

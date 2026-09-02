import type { Request, Response, NextFunction } from "express";
import jwt,{type JwtPayload} from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    id:string
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "unauthorized" });
        return;
    }

    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ error: "invalid token" });
    }
}
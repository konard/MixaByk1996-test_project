import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as AuthPayload;
    req.user = decoded;
  } catch {
    req.user = undefined;
  }

  next();
};

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  } as jwt.SignOptions);
};

export const getContextUser = (req: AuthenticatedRequest): AuthPayload | null => {
  return req.user || null;
};

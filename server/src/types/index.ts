import { Request, Response } from 'express';

export interface AcessTokenPayload {
    userId: number;
}

export interface RefreshTokenPayload {
    userId: number;
    tokenVersion: number;
}

export interface MyContext {
    req: Request;
    res: Response;
    payload?: AcessTokenPayload;
}

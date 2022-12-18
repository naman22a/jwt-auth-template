import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { COOKIE_NAME } from '../../../constants';
import { AcessTokenPayload, RefreshTokenPayload } from '../../../types';

@Injectable()
export class AuthService {
    createAcessToken(user: User) {
        return sign(
            { userId: user.id } as AcessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '15m',
            },
        );
    }

    createRefreshToken(user: User) {
        return sign(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion,
            } as RefreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '7d',
            },
        );
    }

    sendRefreshToken(res: Response, token: string) {
        res.cookie(COOKIE_NAME, token, { httpOnly: true });
    }
}

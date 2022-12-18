import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { AcessTokenPayload, MyContext } from '../../types';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const ctx = GqlExecutionContext.create(
            context,
        ).getContext() as MyContext;

        const authorization = ctx.req.headers['authorization'];

        if (!authorization) throw new UnauthorizedException();

        let payload: AcessTokenPayload | null = null;
        try {
            const token = authorization.split(' ')[1];
            payload = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
            ) as AcessTokenPayload;
            ctx.payload = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }
}

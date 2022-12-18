import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { COOKIE_NAME } from '../../../constants';
import { LoginResponse } from '../../../graphql';
import { RefreshTokenPayload } from '../../../types';
import { UsersService } from '../../../users/users.service';
import { AuthService } from '../../services';

@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    @Post('refresh_token')
    async revokeRefreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const token = req.cookies[COOKIE_NAME];

        if (!token) return { accessToken: '' };

        let payload: RefreshTokenPayload | null = null;

        try {
            payload = verify(
                token,
                process.env.REFRESH_TOKEN_SECRET,
            ) as RefreshTokenPayload;
        } catch (error) {
            return { accessToken: '' };
        }

        const user = await this.usersService.findOneById(payload.userId);
        if (!user) return { accessToken: '' };

        if (user.tokenVersion !== payload.tokenVersion) {
            return { accessToken: '' };
        }

        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);

        // send refresh token
        this.authService.sendRefreshToken(res, refreshToken);

        return { accessToken };
    }
}

import { CookieOptions } from 'express';

export const __prod__ = process.env.NODE_ENV === 'production';
export const CONFIRMATION_PREFIX = 'confirm:';
export const FORGOT_PASSWORD_PREFIX = 'forgot-password:';
export const COOKIE_NAME = 'jid';
export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    path: '/auth/refresh_token',
};

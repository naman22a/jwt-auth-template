import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { v4 } from 'uuid';
import {
    CONFIRMATION_PREFIX,
    FORGOT_PASSWORD_PREFIX,
} from '../../../constants';
import { redis } from '../../../redis';

@Injectable()
export class MailService {
    async sendEmail(email: string, url: string) {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            html: `<a href="${url}">${url}</a>`,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    async createConfirmationUrl(userId: number) {
        const token = v4();

        await redis.set(
            CONFIRMATION_PREFIX + token,
            userId,
            'EX',
            60 * 60 * 24 * 3, // 3 day
        );

        return `http://localhost:3000/confirm/${token}`;
    }

    async createForgotPasswordUrl(userId: number) {
        const token = v4();

        await redis.set(
            FORGOT_PASSWORD_PREFIX + token,
            userId,
            'EX',
            60 * 60 * 5, // 5 hrs
        );

        return `http://localhost:3000/reset-password/${token}`;
    }
}

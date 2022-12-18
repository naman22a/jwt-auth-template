import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    CONFIRMATION_PREFIX,
    FORGOT_PASSWORD_PREFIX,
} from '../../../constants';
import { OkResponse, ResetPasswordDto } from '../../../graphql';
import { redis } from '../../../redis';
import { UsersService } from '../../../users/users.service';
import { MailService, ValidationService } from '../../services';
import * as argon2 from 'argon2';

@Resolver()
export class AdvancedResolver {
    constructor(
        private usersService: UsersService,
        private validationService: ValidationService,
        private mailService: MailService,
    ) {}

    @Mutation('confirmEmail')
    async confirmEmail(
        @Args('token', new ParseUUIDPipe({ version: '4' })) token: string,
    ): Promise<OkResponse> {
        const userId = await redis.get(CONFIRMATION_PREFIX + token);
        if (!userId) return { ok: false };

        const user = await this.usersService.findOneById(parseInt(userId, 10));
        if (!user) return { ok: false };

        const x = await this.usersService.confirm(user.id);
        if (x.count === 0) return { ok: false };

        await redis.del(CONFIRMATION_PREFIX + token);

        return { ok: true };
    }

    @Mutation('forgotPassword')
    async forgotPassword(@Args('email') email: string): Promise<OkResponse> {
        // validation
        const errors = this.validationService.forgotPassword({ email });
        if (errors) return { ok: false, errors };

        // check if user exists
        const user = await this.usersService.findOneByEmail(email);
        if (!user) return { ok: true };

        // send reset password url
        const url = await this.mailService.createForgotPasswordUrl(user.id);
        await this.mailService.sendEmail(email, url);

        return { ok: true };
    }

    @Mutation('resetPassword')
    async resetPassword(
        @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
    ): Promise<OkResponse> {
        // validation
        const errors = this.validationService.resetPassword(resetPasswordDto);
        if (errors) return { ok: false, errors };

        const { token, password } = resetPasswordDto;

        // get userId from redis
        const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
        if (!userId) return { ok: false };

        // find user with userId
        const user = await this.usersService.findOneById(parseInt(userId, 10));
        if (!user) return { ok: false };

        // hashing the password
        const hashedPassword = await argon2.hash(password);

        // update the password
        const x = await this.usersService.updatePassword(
            user.id,
            hashedPassword,
        );
        if (x.count === 0) return { ok: false };

        // delete token from redis
        await redis.del(FORGOT_PASSWORD_PREFIX + token);

        return { ok: true };
    }
}

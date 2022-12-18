import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
    LoginDto,
    LoginResponse,
    OkResponse,
    RegisterDto,
} from '../../../graphql';
import { UsersService } from '../../../users/users.service';
import * as argon2 from 'argon2';
import { AuthService, MailService, ValidationService } from '../../services';
import { MyContext } from '../../../types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../../../constants';

@Resolver()
export class BaseResolver {
    constructor(
        private usersService: UsersService,
        private mailService: MailService,
        private validationService: ValidationService,
        private authService: AuthService,
    ) {}

    @Mutation('register')
    async register(
        @Args('registerDto') registerDto: RegisterDto,
    ): Promise<OkResponse> {
        // validation
        const errors = this.validationService.register(registerDto);
        if (errors) return { ok: false, errors };

        const { name, email, password } = registerDto;

        // check if user already exists in database
        const userExists = await this.usersService.findOneByEmail(email);
        if (userExists) {
            return {
                ok: false,
                errors: [{ field: 'email', message: 'Email already in use' }],
            };
        }

        // hash the password
        const hashedPassword = await argon2.hash(password);

        // save use to database
        const user = await this.usersService.create({
            name,
            email,
            password: hashedPassword,
        });

        // send confirmation email
        const url = await this.mailService.createConfirmationUrl(user.id);
        await this.mailService.sendEmail(email, url);

        return { ok: true };
    }

    @Mutation('login')
    async login(
        @Args('loginDto') loginDto: LoginDto,
        @Context() { res }: MyContext,
    ): Promise<LoginResponse> {
        // validation
        const errors = this.validationService.login(loginDto);
        if (errors) return { accessToken: '', errors };

        const { email, password } = loginDto;

        // check if user exists
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            return {
                accessToken: '',
                errors: [{ field: 'email', message: 'User not found' }],
            };
        }

        // check if password is correct
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return {
                accessToken: '',
                errors: [{ field: 'password', message: 'Incorrect password' }],
            };
        }

        // check if user has confirmed their email
        if (!user.confirmed) {
            return {
                accessToken: '',
                errors: [
                    { field: 'email', message: 'Please confirm your email' },
                ],
            };
        }

        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);

        // send refresh token
        this.authService.sendRefreshToken(res, refreshToken);

        return { accessToken };
    }

    @UseGuards(AuthGuard)
    @Mutation('logout')
    async logout(@Context() { res }: MyContext): Promise<boolean> {
        res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
        return true;
    }
}

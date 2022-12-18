import { Injectable } from '@nestjs/common';
import { isEmpty, isEmail, minLength, isUUID } from 'class-validator';
import {
    FieldError,
    LoginDto,
    RegisterDto,
    ResetPasswordDto,
} from '../../../graphql';

@Injectable()
export class ValidationService {
    register(registerDto: RegisterDto) {
        const { name, email, password } = registerDto;
        const errors: FieldError[] = [];

        if (isEmpty(name)) {
            errors.push({
                field: 'name',
                message: 'Name cannot be blank',
            });
        }

        if (!isEmail(email)) {
            errors.push({
                field: 'email',
                message: 'Invalid Email',
            });
        }

        if (!minLength(password, 6)) {
            errors.push({
                field: 'password',
                message: 'Password must be atleast 6 characters long',
            });
        }

        return errors.length !== 0 ? errors : null;
    }

    login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const errors: FieldError[] = [];

        if (!isEmail(email)) {
            errors.push({
                field: 'email',
                message: 'Invalid Email',
            });
        }

        if (isEmpty(password)) {
            errors.push({
                field: 'password',
                message: 'Password cannot be blank',
            });
        }

        return errors.length !== 0 ? errors : null;
    }

    forgotPassword({ email }: { email: string }) {
        const errors: FieldError[] = [];

        if (!isEmail(email)) {
            errors.push({
                field: 'email',
                message: 'Invalid Email',
            });
        }

        return errors.length !== 0 ? errors : null;
    }

    resetPassword({ password, token }: ResetPasswordDto) {
        const errors: FieldError[] = [];

        if (!isUUID(token, '4')) {
            errors.push({
                field: 'token',
                message: 'Invalid token',
            });
        }

        if (!minLength(password, 6)) {
            errors.push({
                field: 'password',
                message: 'Password must be atleast 6 characters long',
            });
        }

        return errors.length !== 0 ? errors : null;
    }
}

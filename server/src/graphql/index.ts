
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginDto {
    email: string;
    password: string;
}

export class RegisterDto {
    email: string;
    name: string;
    password: string;
}

export class ResetPasswordDto {
    password: string;
    token: string;
}

export class FieldError {
    field: string;
    message: string;
}

export class LoginResponse {
    accessToken: string;
    errors?: Nullable<FieldError[]>;
}

export abstract class IMutation {
    abstract confirmEmail(token: string): OkResponse | Promise<OkResponse>;

    abstract forgotPassword(email: string): OkResponse | Promise<OkResponse>;

    abstract login(loginDto: LoginDto): LoginResponse | Promise<LoginResponse>;

    abstract logout(): boolean | Promise<boolean>;

    abstract register(registerDto: RegisterDto): OkResponse | Promise<OkResponse>;

    abstract resetPassword(resetPasswordDto: ResetPasswordDto): OkResponse | Promise<OkResponse>;
}

export class OkResponse {
    errors?: Nullable<FieldError[]>;
    ok: boolean;
}

export abstract class IQuery {
    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): User[] | Promise<User[]>;
}

export class User {
    createdAt: string;
    email: string;
    id: number;
    name: string;
    updatedAt: string;
}

type Nullable<T> = T | null;

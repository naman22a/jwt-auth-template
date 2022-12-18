import { UseGuards } from '@nestjs/common/decorators';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/guards';
import { MyContext } from '../types';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query('users')
    findUsers() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Query('me')
    async me(@Context() { payload }: MyContext): Promise<User> {
        const { userId } = payload;
        return await this.usersService.findOneById(userId);
    }
}

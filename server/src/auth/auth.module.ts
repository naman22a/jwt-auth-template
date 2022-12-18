import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers';
import { BaseResolver, AdvancedResolver } from './resolvers';
import { AuthService, MailService, ValidationService } from './services';

@Module({
    imports: [UsersModule],
    providers: [
        BaseResolver,
        AdvancedResolver,
        AuthService,
        MailService,
        ValidationService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}

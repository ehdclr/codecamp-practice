import { JwtAcessStrategy } from './strategies/jwt-access.strategy';
import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, //
  ],

  providers: [
    JwtAcessStrategy,
    AuthResolver, //
    AuthService,
  ],
})
export class AuthMoudle {}

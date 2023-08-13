import { JwtAcessStrategy } from './strategies/jwt-access.strategy';
import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, //
  ],

  providers: [
    JwtAcessStrategy,
    JwtGoogleStrategy,
    JwtRefreshStrategy,
    AuthResolver, //
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthMoudle {}

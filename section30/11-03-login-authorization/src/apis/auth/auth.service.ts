import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
} from './interfaces/auth-service.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    //!항상 서비스를 타고 가는 것이 좋음 직접 접근보다는
    private readonly usersService: UsersService, //
    private readonly jwtSerice: JwtService,
  ) {}

  async login({ email, password }: IAuthServiceLogin): Promise<string> {
    // 1.이메일 일치하는 유저 찾기
    const user = await this.usersService.findOneByEmail({ email });

    // 2.이메일 일치하는 유저 없으면 => 에러
    if (!user) {
      throw new UnprocessableEntityException(
        '이메일이 없습니다. 회원가입을 먼저 해주세요!',
      );
    }

    // 3.일치하는 유저가 있지만, 비밀번호가 틀렸다면?
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('암호가 틀렸습니다');
    }

    // 4. 일치하는 유저도 있고, 비밀번호도 맞았다면?
    // => accessToken(=JWT)을 만들어서 브라우저에 전달
    //sign이 토큰 만들기 , 뒤에가 비밀번호
    return this.getAccessToken({ user });
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtSerice.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}

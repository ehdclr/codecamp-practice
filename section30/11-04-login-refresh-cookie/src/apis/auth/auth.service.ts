import {
  Injectable,
  UnprocessableEntityException,
  Controller,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    //!항상 서비스를 타고 가는 것이 좋음 직접 접근보다는
    private readonly usersService: UsersService, //
    private readonly jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
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

    //4. refreshToken(=jwt)를 만들어서 브라우저 쿠키에 저장해서 보내주기
    this.setRefreshToken({ user, context });

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?
    // => accessToken(=JWT)을 만들어서 브라우저에 전달
    //sign이 토큰 만들기 , 뒤에가 비밀번호
    return this.getAccessToken({ user });
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, context }: any): void {
    //* RefreshToken 만들기
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: '나의리프레시비밀번호', expiresIn: '2w' },
    );

    //!개발환경에서 만듬
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );

    //!배포 할 땐 https로 배포하기 때문에
    //!도메인은 어디서 발급을 했는지
    //!https에서만 사용
    //!sameSite는 같은 주소만
    //!httpOnly는 js 못쓰게
    // context.res.setHeader(
    //   'set-Cookie',
    //   `refreshToken=${refreshToken}; path=/; domain= mybackendsite.com; sameSite=None; Secure; httpOnly`,
    // );

    // //* 받아서 사용가능한 사람을 정해줘야함
    // context.res.setHeader("Access-Control-Allow-Origin","https://myfronsite.com");
  }
}

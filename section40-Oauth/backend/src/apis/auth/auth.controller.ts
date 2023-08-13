import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

interface IOauthUser {
  user: {
    name: string;
    email: string;
    password: string;
    age: number;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async loginGoogle(
    @Req() req: Request & IOauthUser, //
    @Res() res: Response,
  ) {
    //프로필을 받아온 다음, 로그인 처리해야하는 곳
    //1.회원조회
    const user = await this.usersService.findOneByEmail({
      email: req.user.email,
    });

    //2.회원가입이 안되어있다면? 자동회원가입
    if (!user)
      this.usersService.create({
        ...req.user,
      }); //회원가입

    //3.회원가입이 돼있다면? 1,2둘다 이미 충족
    //가입된 유저로 로그인하기(refresh,accessToken만들어서 브라우저에 전송)
    this.authService.setRefreshToken({ user, res });

    //응답에 어디로 페이지 리다이렉트 할지 정보를 줌
    //브라우저에 정보를 줌
    res.redirect(' http://localhost:5500/frontend/index.html');
  }
}

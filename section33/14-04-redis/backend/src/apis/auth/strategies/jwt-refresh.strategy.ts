import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// import {kakaoStrategy} from "passport-kakao" -> 이것만 교체해주면 accessStrategy는 카카오로그인을 따른다.

//Jwt 기반의 strategy가 됨
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: '나의리프레시비밀번호',
    });
  }

  validate(payload) {
    return {
      id: payload.sub,
    };
    //req.user에 자동으로저장
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// import {kakaoStrategy} from "passport-kakao" -> 이것만 교체해주면 accessStrategy는 카카오로그인을 따른다.

//Jwt 기반의 strategy가 됨
export class JwtAcessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      //! 1번방법
      //   jwtFromRequest: (req) => {
      //     const temp = req.headers.authorization; //Bearer sadfdjhsdkfjhds
      //     const accessToken = temp.toLowerCase().replace('bearer ', '');
      //     return accessToken;
      //   }, //acessToken

      //! 2번방법
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '나의비밀번호', //비밀번호는 맞춰야함 부모 constructor에 들어가서 검증을 해준다 , 1. 비밀번호 검증과 2.만료검증 두개를 진행한다.
      //실패하면 에러, 성공하면 validate함수가 실행
    }); //부모에 constructor에 넘겨주고 싶을 때 사용
    //super안에 넣어서 부모의 PassportStrategy에 넘어간다.
  }

  validate(payload) {
    // console.log(payload); // ! jwt토큰에 넣은 payload값이 나옴  {sub: userId}

    return {
      id: payload.sub,
    };

    //! req안에 user라는 키가 자동으로 만들어지고 req.user안에 return이 담긴다.
  }
}

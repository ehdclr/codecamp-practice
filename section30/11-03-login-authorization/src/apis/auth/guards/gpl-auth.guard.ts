import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
export class GqlAuthAccessGuard extends AuthGuard('access') {
  //나만의인가를 상속받아서 reuqest를 바꿔치기함
  //이름은 꼭 반드시 getRequest 해야함 -> 오버라이딩 해야하기 때문
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req; //정상적인 request를 뽑아옴
  }
}

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test, TestingModule } from '@nestjs/testing';

//mock
class MockAppService {
  //모킹을 해도 이름은 같은 함수여야함
  getHello(): string {
    return '나는 가짜다!';
  }
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    //테스팅 모듈 , appModule과 비슷하다 생각
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useClass: MockAppService,
        },
      ],
    }).compile(); //compile -> 최적화

    appController = app.get<AppController>(AppController); // 의존성 주입된 controller뽑아오기
  });
  describe('getHello ', () => {
    it('이 테스트의 검증 결과는 Hello World!를 리턴해야함', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  //   describe('fetchBoards', () => {});
  //   describe('createBoard', () => {});
});

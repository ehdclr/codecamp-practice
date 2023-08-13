import { IBoardsServiceCreate } from './interfaces/boards-service.interface';
import { Injectable, Scope } from '@nestjs/common';
import { Board } from './entities/board.entity';

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  findAll(): Board[] {
    const result = [
      {
        number: 1,
        writer: '철수',
        title: '제목입니다~~',
        contents: '내용이에요@@@',
      },
      {
        number: 2,
        writer: '영희',
        title: '영희 제목입니다~~',
        contents: '영희 내용이에요@@@',
      },
      {
        number: 3,
        writer: '훈이',
        title: '훈이 제목입니다~~',
        contents: '훈이 내용이에요@@@',
      },
    ];

    return result;
  }

  create({ createBoardInput }: IBoardsServiceCreate): string {
    console.log(createBoardInput.writer);
    console.log(createBoardInput.title);
    console.log(createBoardInput.contents);

    return '게시물 등록에 성공하였습니다.';
  }
}

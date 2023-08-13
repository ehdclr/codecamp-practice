import { BoardsService } from './board.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Board } from './entities/board.entity';
import { CreateBoardInput } from './dto/create-board.input';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

// @Controller()

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardService: BoardsService, //
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache, //캐시 매니저에서 불러오기
  ) {}

  @Query(() => String, { nullable: true })
  async fetchBoards(): Promise<string> {
    //1.캐시에서 조회하는 연습
    const mycache = await this.cacheManager.get('qqq');
    console.log(mycache);

    //2.조회완료 메시지 전달.
    return '캐시에서 조회 완료';

    //redis연습을 위한 주석걸기
    // return this.boardService.findAll();
  }

  @Mutation(() => String)
  async createBoard(
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args({ name: 'contents', nullable: true }) contents: string,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ): Promise<string> {
    //1. 캐시에 등록하는 연습
    await this.cacheManager.set('qqq', createBoardInput, -1); // 캐시매니저에서는 ttl이 0이 영구저장
    console.log('ggg');

    //2. 등록완료 메시지 전달.
    return '캐시에 등록 완료';

    //레디스 연습을 위한 주석걸기
    // return this.boardService.create({ createBoardInput });
  }
}

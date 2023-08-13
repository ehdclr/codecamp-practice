import { BoardsService } from './board.service';
import { Query, Resolver } from '@nestjs/graphql';

// @Controller()

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardService: BoardsService, //
  ) {}

  @Query(() => String)
  getHello(): string {
    return this.boardService.getHello();
  }
}

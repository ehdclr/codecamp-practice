import { BoardsResolver } from './board.resolver';
import { BoardsService } from './board.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [BoardsService, BoardsResolver],
})
export class BoardsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';
import { IPointsTransactionsServiceCreate } from './interfaces/points-transactions-service.interface';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async create({
    impUid,
    amount,
    user: _user,
  }: IPointsTransactionsServiceCreate): Promise<PointTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    //! queryRunner 시작지점
    await queryRunner.startTransaction();

    //!try-catch 문 시작
    try {
      //!트랜잭션 커밋시

      //1.PointTransaction 테이블에 거래기록 1줄 생성

      const pointTransaction = await this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(pointTransaction);

      const user = await queryRunner.manager.findOne(User, {
        where: { id: _user.id },
      });

      const updatedUser = this.usersRepository.create({
        ...user, // 수정이 됨
        point: user.point + amount,
      });

      //update를 save로 바꿀 수도 있음
      await queryRunner.manager.save(updatedUser);

      //! queryRunner 의 커밋
      await queryRunner.commitTransaction();
      

      //!실패했을 때 롤백

      //4. 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      //!트랜잭션 롤백해야할 때 (커밋 실패 시)
      await queryRunner.rollbackTransaction(); //임시로 달아놓은 것들 초기화

    
    } finally{
      //성공하든 실패하든 진행 하는것
      await queryRunner.release(); //쿼리 러너 연결 끊기
      //롤백하고 커밋을 해도 디비와 연결을 끊어야함
    }
  }
}

import { UsersModule } from './apis/users/users.module';
import { BoardsModule } from './apis/boards/board.module';
import { ProductsModule } from './apis/products/products.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsCategoriesModule } from './apis/productsCategories/productsCategories.module';
import { AuthMoudle } from './apis/auth/auth.module';
import { PointsTransactionsModule } from './apis/pointsTransactions/pointsTransactions.module';
import { PaymentsMoudle } from './apis/payments/payments.module';
import { FilesModule } from './apis/files/files.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthMoudle,
    BoardsModule, //
    ProductsModule,
    ProductsCategoriesModule,
    UsersModule,
    PointsTransactionsModule,
    PaymentsMoudle,
    FilesModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => {
        return {
          req,
          res,
        };
        //req는 기본적으로 들어오지만, res는 이걸 작성해줘야 들어옴
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379', //docker 레디스 네임 리졸루션 이용해서 사용
      isGlobal: true, //전역으로 사용가능
    }),
  ],
})
export class AppModule {}

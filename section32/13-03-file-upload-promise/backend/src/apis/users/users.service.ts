import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
} from './interfaces/users-service.interface';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //!이메일 있는지 검증
  findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async create({
    email,
    password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    const isExistUser = await this.findOneByEmail({ email });

    const hashedPassword = await bcrypt.hash(password, 10); //!얘도 원래 hash메소드 만들어서 가져와서 써야함-> 일단 실습이니 진행

    if (isExistUser) {
      //throw new HttpException("이미 등록된 이메일입니다.",HttpStatus.CONFLICt);
      throw new ConflictException('이미 등록된 이메일 입니다.');
    }
    return this.usersRepository.save({
      email,
      password: hashedPassword,
      name,
      age,
    });
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/qqq')
  getHello(): string {
    return '철수 성공';
  }

  @Get('/qqq2')
  getHello2(): string {
    return '영희 성공1';
  }
}

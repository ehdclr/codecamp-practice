import { IProductServiceFindOne } from './../../../dist/apis/products/interfaces/products-service-findOne.interface.d';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { IProductsServiceCreate } from './interfaces/products-service.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
  ) {}
  //!모두 조회하기
  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  //!한개 조회하기
  findOne({ productId }: IProductServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: productId } });
  }

  //!등록하기
  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const result = await this.productsRepository.save({
      ...createProductInput,
    });

    //result 안에는 무엇이 있을까?
    return result;
  }
}

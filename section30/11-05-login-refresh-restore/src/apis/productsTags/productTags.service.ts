import {
  IProductsTagsServiceBulkInsert,
  IProductTagsServiceFindByNames,
} from './interfaces/products-tags-service.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';

@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productTagsRepository: Repository<ProductTag>,
  ) {}

  findByNames({ tagNames }: IProductTagsServiceFindByNames) {
    return this.productTagsRepository.find({
      where: { name: In(tagNames) },
    });
  }

  async bulkInsert({ names }: IProductsTagsServiceBulkInsert) {
    return this.productTagsRepository.insert(names);
  }

}

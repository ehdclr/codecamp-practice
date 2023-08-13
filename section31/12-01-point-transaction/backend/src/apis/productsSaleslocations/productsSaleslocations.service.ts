import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductSaleslocation } from './entities/productSaleslocation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsSalesLocationsService {
  constructor(
    @InjectRepository(ProductSaleslocation)
    private readonly productSaleslocationsRepository: Repository<ProductSaleslocation>, //
  ) {}

  create({ productSaleslocation }) {
    return this.productSaleslocationsRepository.save({
      ...productSaleslocation,
    });
  }

  
}

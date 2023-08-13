import {
  IProductsCheckSoldOut,
  IProductServiceFindOne,
  IProductsServiceDelete,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
  
 //asd
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

  //!업데이트
  async update({ productId, updateProductInput }: IProductsServiceUpdate) {
    //!기존 있는 내용을 재사용하여 로직을 통일하자
    const product = await this.findOne({ productId });

    //!검증은 서비스에서 하자
    this.checkSoldout({ product });

    const result = await this.productsRepository.save({
      ...product, //! 수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 돌려받고 싶을 때 ,
      ...updateProductInput, //! 수정
    });
    return result;
  }

  //! 1.CheckSoldout을 함수로 만드는 이유 => 수정시, 삭제시  등 같은 검증 로직 사용
  checkSoldout({ product }: IProductsCheckSoldOut): void {
    //!이미 판매가 된 상품이면 수정을 불가능 하게 검증을 해줘야함
    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
    }
  }

  //삭제
  async  delete({productId} :IProductsServiceDelete): Promise<boolean> {

    //! typeorm 소프트 삭제 
    const result = await this.productsRepository.softDelete({id:productId});
    return result.affected ? true : false // 삭제 영향이 됐으면 true, 없으면 false

  }
  

}

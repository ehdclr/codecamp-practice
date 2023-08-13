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
import { ProductsSalesLocationsService } from '../productsSaleslocations/productsSaleslocations.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
    private readonly productsSaleslocationsService: ProductsSalesLocationsService,
  ) {}
  //!모두 조회하기
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  //asd
  //!한개 조회하기
  findOne({ productId }: IProductServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  //!등록하기
  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    //! 1.상품 하나만 등록할 때 사용하는 방법
    // const result = await this.productsRepository.save({
    //   ...createProductInput,
    // });

    //! 2. 상품과 상품거래 위치를 같이 등록하는 방법
    const { productSaleslocation, productcategoryId, ...product } =
      createProductInput; //디스트럭처링

    const result = await this.productsSaleslocationsService.create({
      productSaleslocation,
    }); //!서비스를 타고 가야하는 이유는 ...?
    //! 레포지토리에 직접 접근하면 검증 로직을 통일 시킬 수 없음!!

    // const result2 = await this.productsRepository.save({
    //   ...product,
    //   productSaleslocation: {
    //     id: result, //! 이러면 Product테이블에서 productSaleslcoationId값에 들어감
    //   },
    // });
    const result2 = await this.productsRepository.save({
      ...product,
      productSaleslocation: result,
      productCategory: {
        id: productcategoryId,

        //TODO 만약 name까지 받고 싶으면?
        //! => createProductInput에 name까지 포함해서 받아오기 !(Option)
      },
    });

    return result2;
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
  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    //! typeorm 소프트 삭제
    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false; // 삭제 영향이 됐으면 true, 없으면 false
  }
}

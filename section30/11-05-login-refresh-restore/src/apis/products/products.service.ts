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
import { In, ProfilingLevel, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { IProductsServiceCreate } from './interfaces/products-service.interface';
import { ProductsSalesLocationsService } from '../productsSaleslocations/productsSaleslocations.service';
import { ProductsTagsService } from '../productsTags/productTags.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
    private readonly productsSaleslocationsService: ProductsSalesLocationsService, //
    private readonly productsTagsService: ProductsTagsService,
  ) {}
  //!모두 조회하기
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

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

    //! 2-1 상품과 상품거래 위치를 같이 등록하는 방법
    const { productSaleslocation, productcategoryId, productTags, ...product } =
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

    //! 2-2 ) 상품 태그 등록
    //productTags가 ["#전자제품","#영등포"]와 같은 패턴이라고 가정

    const tagNames = productTags.map((el) => el.replace('#', ''));
    const prevTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = [];

    tagNames.forEach((el) => {
      const isExist = prevTags.find((prevEl) => {
        return el === prevEl.name;
      });

      if (!isExist) temp.push({ name: el });
    });

    const newTags = await this.productsTagsService.bulkInsert({ names: temp });
    const tags = [...prevTags, ...newTags.identifiers]; //기존의 태그와 새로운 태그

    const result2 = await this.productsRepository.save({
      ...product,
      productSaleslocation: result,
      productCategory: {
        id: productcategoryId,

        //TODO 만약 name까지 받고 싶으면?
        //! => createProductInput에 name까지 포함해서 받아오기 !(Option)
      },
      productTags: tags,
    });

    return result2;
  }

  //!업데이트
  async update({
    productId,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const { productTags, ...newProduct } = updateProductInput;

    //!기존 있는 내용을 재사용하여 로직을 통일하자
    const prevProduct = await this.findOne({ productId });

    //!검증은 서비스에서 하자
    this.checkSoldout({ product: prevProduct });

    //   //TODO 숙제 -1 왜 아래 에러가 나는지?
    //   //TODO 숙제 -2 아래 에러 고쳐보기

    /**
     *  TODO (v) 태그를 바꾸는 것은 id값은 그대로 냅두고 내용만 바꾸고 product와 tag테이블 바꾸면됨
     *  TODO 등록해둔 해시태그는 삭제 x -> 나중에 다시 쓸 수도 있어서 -> 다시 기존에 있던걸로 바꾸면?
     *  TODO productSaleslocation은 id값을 찾아서 saleslocation 수정  -> 1.여기서 직접 수정?->
     *  TODO->2.service에서 직접하는 방법
     *  TODO categoryId는 Product에서 Id를 바꾸면됨
     */

    //!
    const tagNames = productTags.map((el) => el.replace('#', ''));
    const existTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = [];
    tagNames.forEach((el) => {
      const isExist = existTags.find((existEl) => {
        return el === existEl.name;
      });

      if (!isExist) temp.push({ name: el });
    });

    const newTags = await this.productsTagsService.bulkInsert({ names: temp });
    const tags = [...existTags, ...newTags.identifiers];

    const result = await this.productsRepository.save({
      ...prevProduct, //! 수정 후, 수정되지 않은 다른 결과값까지 모두 객체로 돌려받고 싶을 때 ,
      ...newProduct, //! 새로운 내용 수정
      productTags: tags,
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

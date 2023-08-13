import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createProductInput } from './dto/create-product.input';
import { updateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productService: ProductsService, //
    private readonly elasticSearchService: ElasticsearchService,
  ) {}

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }
  @Query(() => Product)
  async fetchProduct(@Args('productId') productId: string): Promise<Product> {
    // //엘라스틱서치에서 조회하기 연습!!
    // const result = await this.elasticSearchService.search({
    //   index: 'myproduct03',
    //   query: {
    //     match_all: {},
    //   },
    // });
    // console.log(result);

    return this.productService.findOne({ productId });
  }

  //!상품 등록
  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: createProductInput,
  ): Promise<Product> {
    // //TODO 엘라스틱 서치에 등록하기 연습!!(연습 이후에 삭제하기)
    // this.elasticSearchService.create({
    //   id: 'myid',
    //   index: 'myproduct03',
    //   document: {
    //     name: '철수',
    //     age: 13,
    //     school: '다람쥐초등학교',
    //   },
    // });

    //!<< 브라우저에 결과 보내주는 2가지 방법>>
    //! 1.등록된 내용이 담긴 객체를 그대로 브라우저에 돌려보내주기 --> 보통 이 방법 씀
    return this.productService.create({ createProductInput });

    //! 2. 결과메시지만 간단히 보내주기
    //! return "정상적으로 상품이 등록되었습니다.";
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: updateProductInput,
  ): Promise<Product> {
    return this.productService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string): Promise<boolean> {
    return this.productService.delete({ productId });
  }
}

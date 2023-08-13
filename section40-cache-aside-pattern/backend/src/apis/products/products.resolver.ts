import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { createProductInput } from './dto/create-product.input';
import { updateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productService: ProductsService, //
    private readonly elasticSearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }
  @Query(() => Product)
  async fetchProduct(
    @Args('search') search: string, //
  ): any {
    //1.redis에 캐시되어 있는지 확인하기
    const productCache = await this.cacheManager.get(`products:${search}`); //products라는 이름으로 캐싱 - 검색어 캐싱 -> fetchProducts와 검색어 캐싱
    if (productCache) return productCache;

    //2. redis에 캐시가 되어 있지 않다면, 엘라스틱 서치에서 조회하기 (유저가 검색한 검색어로 조회하기)
    const result = await this.elasticSearchService.search({
      index: 'myproduct',
      query: { match: { name: search } },
    });

    const products = result.hits.hits.map((el: any) => ({
      id: el._source.id,
      name: el._source.name,
      price: el._source.price,
    }));

    //3.엘라스틱서치에서 조회결과가 있다면, 레디스에 검색결과 캐싱해놓기
    this.cacheManager.set(`products:${search}`,products,{ttl:0}) //키는 products:search고 값은 products ttl을 무제한으로 -> ttl은 버전마다 다름

    //4.최종결과 브라우저에 리턴해주기

    return products;
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

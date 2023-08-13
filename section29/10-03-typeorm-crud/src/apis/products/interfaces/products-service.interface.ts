import { createProductInput } from '../dto/create-product.input';

export interface IProductsServiceCreate {
  createProductInput: createProductInput;
}

export interface IProductServiceFindOne {
  productId: string;
}

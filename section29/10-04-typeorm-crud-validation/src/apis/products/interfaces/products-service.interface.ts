import { createProductInput } from '../dto/create-product.input';
import { updateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

export interface IProductsServiceCreate {
  createProductInput: createProductInput;
}

export interface IProductServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  productId: string;
  updateProductInput: updateProductInput;
}

export interface IProductsCheckSoldOut {
  product: Product;
}

import { InputType, PartialType } from '@nestjs/graphql';
import { createProductInput } from './create-product.input';

@InputType()
export class updateProductInput extends PartialType(createProductInput) {}

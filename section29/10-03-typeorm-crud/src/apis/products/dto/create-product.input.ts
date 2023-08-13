import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class createProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  price: number;
}

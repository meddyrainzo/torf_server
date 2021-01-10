import { Field, InputType } from 'type-graphql';

@InputType()
export class UserIdentityInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

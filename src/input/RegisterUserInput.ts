import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterUserInput {
  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

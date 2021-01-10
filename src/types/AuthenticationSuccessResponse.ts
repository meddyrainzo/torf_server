import { User } from '../entities/User';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthenticationSuccessResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}

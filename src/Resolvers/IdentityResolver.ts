import { Query, Resolver } from 'type-graphql';

@Resolver()
export class IdentityResolver {
  @Query(() => String)
  hello() {
    return 'Hi';
  }
}

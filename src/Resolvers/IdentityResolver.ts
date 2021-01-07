import { User } from '../entities/User';
import { RegisterUserInput } from '../input/RegisterUserInput';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { hash } from 'bcrypt';

@Resolver()
export class IdentityResolver {
  @Query(() => User)
  async getRegisteredUserById(@Arg('userId') userId: number): Promise<User> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      console.log(err);
      throw new Error('There was an error retrieving the user');
    }
  }

  @Mutation(() => User)
  async registerUser(@Arg('registerationInfo') input: RegisterUserInput) {
    const { name, username, password } = input;
    this.checkUserNameUnique(username);
    const hashedPassword = await hash(password, 10);
    try {
      const user = User.create({ name, username, password: hashedPassword });
      await user.save();
      return user;
    } catch (err) {
      throw new Error('There was an error in creating the user');
    }
  }

  private async checkUserNameUnique(username: string) {
    const user = await User.findOne({ username });
    if (user) {
      throw new Error('The username has been taken');
    }
  }
}

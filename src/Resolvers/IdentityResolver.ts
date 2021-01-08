import { User } from '../entities/User';
import { RegisterUserInput } from '../input/RegisterUserInput';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcrypt';
import { generate } from 'rand-token';
import { LoginUserInput } from '../input/LoginUserInput';
import { LoginSuccessResponse } from '../types/LoginSuccessResponse';
import { RefreshToken } from '../entities/RefreshToken';
import { createAccessToken } from '../service/createAccessToken';
import { TorfContext } from '../context/TorfContext';
import { authMiddleware } from '../middleware/authMiddleware';

@Resolver()
export class IdentityResolver {
  @Query(() => User)
  @UseMiddleware(authMiddleware)
  async getRegisteredUserById(@Ctx() context: TorfContext): Promise<User> {
    try {
      const user = await User.findOne({ username: context.username });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      console.log(err);
      throw new Error('There was an error retrieving the user');
    }
  }

  @Mutation(() => Boolean)
  async registerUser(@Arg('registerationInfo') input: RegisterUserInput) {
    const { name, username, password } = input;
    this.checkUserNameUnique(username);
    const hashedPassword = await hash(password, 10);
    try {
      const result = await User.insert({
        name,
        username,
        password: hashedPassword,
      });
      return result.identifiers !== null;
    } catch (err) {
      throw new Error('There was an error in creating the user');
    }
  }

  @Mutation(() => LoginSuccessResponse)
  async loginUser(
    @Arg('loginInfo') input: LoginUserInput,
    @Ctx() context: TorfContext
  ) {
    const { username, password } = input;
    const invalidLoginDetails = 'Invalid username and/or password';
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User with the username does not exist');
      throw new Error(invalidLoginDetails);
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Wrong password sent for the user');
      throw new Error(invalidLoginDetails);
    }

    const accessToken = createAccessToken(username);

    const refreshToken = await this.createRefreshToken(username);
    context.request.headers['authentication'] = refreshToken;
    context.username = username;
    const response: LoginSuccessResponse = { user, accessToken };
    return response;
  }

  private async checkUserNameUnique(username: string) {
    const user = await User.findOne({ username });
    if (user) {
      throw new Error('The username has been taken');
    }
  }

  private async createRefreshToken(username: string): Promise<string> {
    const refreshToken = generate(128);
    const tokenExpiryDate = new Date();
    tokenExpiryDate.setDate(tokenExpiryDate.getMonth() + 1);
    const tokenCreationResult = await RefreshToken.insert({
      token: refreshToken,
      username,
      expiryDate: tokenExpiryDate,
    });
    if (!tokenCreationResult.identifiers) {
      throw new Error('Failed to generate token for user');
    }
    return refreshToken;
  }
}

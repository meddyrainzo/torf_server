import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcrypt';
import { UserIdentityInput } from '../input/UserIdentityInput';
import { AuthenticationSuccessResponse } from '../types/AuthenticationSuccessResponse';
import {
  createAccessToken,
  createRefreshToken,
} from '../service/createAccessToken';
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

  @Mutation(() => AuthenticationSuccessResponse)
  async registerOrLoginUser(
    @Arg('userInfo') userInfo: UserIdentityInput,
    @Ctx() context: TorfContext
  ) {
    const { username, password } = userInfo;
    const user = await User.findOne({ username });
    if (user) {
      const errorMessage = 'Invalid username and/or password';
      return await this.loginUser(user, password, context, errorMessage);
    }
    const hashedPassword = await hash(password, 10);
    try {
      let createdUser = User.create({ username, password: hashedPassword });
      const result = await createdUser.save();
      return await this.createAccessAndRefreshToken(result, context);
    } catch (err) {
      console.error(`There was an error in registering the user :: ${err}`);
      throw new Error('Error joining the fun');
    }
  }

  private async loginUser(
    user: User,
    password: string,
    context: TorfContext,
    errorMessage: string
  ): Promise<AuthenticationSuccessResponse> {
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Wrong password sent for the user');
      throw new Error(errorMessage);
    }
    return await this.createAccessAndRefreshToken(user, context);
  }

  private async createAccessAndRefreshToken(
    user: User,
    context: TorfContext
  ): Promise<AuthenticationSuccessResponse> {
    const { username } = user;
    const accessToken = createAccessToken(username);
    const refreshToken = await createRefreshToken(username);
    context.request.headers['authorization'] = accessToken;
    context.request.headers['x-auth-token'] = refreshToken;
    context.username = username;
    const response: AuthenticationSuccessResponse = { user, accessToken };
    return response;
  }
}

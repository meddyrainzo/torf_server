import { verify } from 'jsonwebtoken';
import { TorfContext } from '../context/TorfContext';
import { RefreshToken } from '../entities/RefreshToken';
import {
  createAccessToken,
  insertCookiesInResponse,
} from '../service/createAccessToken';
import { MiddlewareFn } from 'type-graphql';
import { tokenConfig } from '../configs';

export const authMiddleware: MiddlewareFn<TorfContext> = async (
  { context },
  next
) => {
  const { login, refresh } = context.request.cookies;
  const token = login;
  const userNotAuthenticated = 'User not authenticated';
  if (!token) {
    throw new Error(userNotAuthenticated);
  }
  try {
    const payload = verify(token, tokenConfig.secret);
    context.username = (<any>payload).username;
  } catch (err) {
    const refreshToken = refresh;
    if (!refreshToken) {
      throw new Error(userNotAuthenticated);
    }
    const token = await RefreshToken.findOne({ token: <string>refreshToken });
    if (!token) {
      throw new Error(userNotAuthenticated);
    }
    checkIfTokenIsRevoked(token, userNotAuthenticated);
    slideExpirationDateIfExpired(token, userNotAuthenticated);
    const newAccessToken = createAccessToken(token.username);
    context.username = token.username;
    insertCookiesInResponse(context, newAccessToken, token.token);
    return next();
  }
  return next();
};

function checkIfTokenIsRevoked(token: RefreshToken, errorMessage: string) {
  if (token.isRevoked) {
    console.error('The token  was revoked');
    throw new Error(errorMessage);
  }
}

async function slideExpirationDateIfExpired(
  token: RefreshToken,
  errorMessage: string
) {
  const { expiryDate } = token;
  const currentDate = new Date();
  try {
    if (currentDate > expiryDate) {
      token.expiryDate.setDate(currentDate.getMonth() + 1);
      await RefreshToken.save(token);
    }
  } catch (err) {
    console.log('Failed to slide the expiration date of the refresh token');
    throw new Error(errorMessage);
  }
}

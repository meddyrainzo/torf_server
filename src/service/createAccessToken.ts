import { sign } from 'jsonwebtoken';
import { generate } from 'rand-token';
import { RefreshToken } from '../entities/RefreshToken';
import { tokenConfig } from '../configs';

export const createAccessToken = (username: string): string => {
  const { secret } = tokenConfig;
  return sign({ username }, secret, { expiresIn: '15m' });
};

export const createRefreshToken = async (username: string): Promise<string> => {
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
};

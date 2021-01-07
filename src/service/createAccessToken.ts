import { sign } from 'jsonwebtoken';
import { tokenConfig } from 'src/configs';

export function createAccessToken(username: string): string {
  const { secret } = tokenConfig;
  return sign({ username }, secret, { expiresIn: '15m' });
}

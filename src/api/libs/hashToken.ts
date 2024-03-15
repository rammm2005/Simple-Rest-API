import * as crypto from 'crypto';

export async function hashToken(refreshToken: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(refreshToken, salt, 10000, 512, 'sha512').toString('hex');
  return `${salt}${hash}`;
}



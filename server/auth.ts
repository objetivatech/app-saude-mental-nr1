import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

/**
 * Hash a password using scrypt (built-in Node.js crypto)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const hashBuffer = Buffer.from(hash, 'hex');
  const suppliedHashBuffer = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, suppliedHashBuffer);
}

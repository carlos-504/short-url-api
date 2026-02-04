import Hashids from 'hashids';

const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SALT = process.env.HASHIDS_SALT ?? 'short-url-api';
const MAX_LENGTH = 6;

const hashids = new Hashids(SALT, 0, ALPHABET);

export function encodeId(id: number): string {
  const encoded = hashids.encode(id);
  if (encoded.length > MAX_LENGTH) {
    throw new Error(`Encode excedeu o limite de ${MAX_LENGTH} caracteres`);
  }
  return encoded;
}

export function decodeId(code: string): number | null {
  if (code.length === 0 || code.length > MAX_LENGTH) return null;
  const decoded = hashids.decode(code);
  if (decoded.length === 0) return null;
  const value = decoded[0];
  return value != null ? Number(value) : null;
}

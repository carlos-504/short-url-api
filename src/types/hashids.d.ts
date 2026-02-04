declare module 'hashids' {
  export default class Hashids {
    constructor(salt?: string, minLength?: number, alphabet?: string);
    encode(...numbers: (number | bigint)[]): string;
    decode(id: string): (number | bigint)[];
  }
}

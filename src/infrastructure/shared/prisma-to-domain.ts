export function mapPrismaToDomain<T>(row: object): T {
  return { ...row } as T;
}

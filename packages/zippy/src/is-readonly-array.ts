export function isReadonlyArray<T extends readonly unknown[]>(
  value: T,
): value is T
export function isReadonlyArray(value: unknown): value is readonly unknown[]
export function isReadonlyArray(value: unknown) {
  return Array.isArray(value)
}

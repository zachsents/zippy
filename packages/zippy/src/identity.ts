/**
 * Returns the passed value unchanged.
 *
 * @example
 *   const value = { name: "zippy" }
 *   identity(value) // value
 */
export function identity<T>(value: T): T {
  return value
}

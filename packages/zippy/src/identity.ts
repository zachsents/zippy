/**
 * Returns the passed value unchanged.
 *
 * @example
 *   const value = { name: "zippy" }
 *   identity(value) // value
 *
 * @param value - The value to process.
 * @returns The input value.
 */
export function identity<T>(value: T): T {
  return value
}

import type { Get } from "type-fest"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorPath,
} from "./selector"

export type Falsy = false | 0 | 0n | "" | null | undefined
export type Truthy<T> = Exclude<T, Falsy>

export function isNullish<T>(value: T): value is T & (null | undefined) {
  return value == null
}

// The `T extends unknown` condition distributes over unions. Keep the inner
// `Path extends SelectorPath<T>` checks even on authoritative overloads: the
// generic constraint proves the path against the original `T`, but distribution
// rebinds `T` to each union variant, where variants without the path must drop
// out as `never`.
// authoritative curry; nullish path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is null or undefined.
 *
 * @example
 *   type User = { profile?: { name?: string | null } | null }
 *   const hasMissingName = propIsNullish<User>("profile.name")
 */
export function propIsNullish<
  T,
  Path extends SelectorPath<T> = SelectorPath<T>,
>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & (null | undefined)>
    : never
  : never

// generic curry; nullish path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is null or undefined.
 *
 * @example
 *   const values = [{ name: "Ada" }, { name: null }]
 *   values.filter(propIsNullish("name")) // [{ name: null }]
 */
export function propIsNullish<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & (null | undefined)>
    : never
  : never
export function propIsNullish(path: string) {
  return (value: unknown) => isNullish(getPropertyPathValue(value, path))
}

export function isNonNullish<T>(value: T): value is NonNullable<T> {
  return value != null
}

// authoritative curry; non-nullish path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is not null or undefined.
 *
 * @example
 *   type User = { profile?: { name?: string | null } | null }
 *   const hasName = propIsNonNullish<User>("profile.name")
 */
export function propIsNonNullish<
  T,
  Path extends SelectorPath<T> = SelectorPath<T>,
>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, NonNullable<Get<T, Path>>>
    : never
  : never

// generic curry; non-nullish path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is not null or undefined.
 *
 * @example
 *   const values = [{ name: "Ada" }, { name: null }]
 *   values.filter(propIsNonNullish("name")) // [{ name: "Ada" }]
 */
export function propIsNonNullish<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, NonNullable<Get<T, Path>>>
    : never
  : never
export function propIsNonNullish(path: string) {
  return (value: unknown) => isNonNullish(getPropertyPathValue(value, path))
}

export function isTruthy<T>(value: T): value is Truthy<T> {
  return Boolean(value)
}

// authoritative curry; truthy path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is truthy.
 *
 * @example
 *   type User = { profile?: { name?: string | null } | null }
 *   const hasName = propIsTruthy<User>("profile.name")
 */
export function propIsTruthy<T, Path extends SelectorPath<T> = SelectorPath<T>>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Truthy<Get<T, Path>>>
    : never
  : never

// generic curry; truthy path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is truthy.
 *
 * @example
 *   const values = [{ name: "Ada" }, { name: "" }]
 *   values.filter(propIsTruthy("name")) // [{ name: "Ada" }]
 */
export function propIsTruthy<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Truthy<Get<T, Path>>>
    : never
  : never
export function propIsTruthy(path: string) {
  return (value: unknown) => isTruthy(getPropertyPathValue(value, path))
}

export function isFalsy<T>(value: T): value is T & Falsy {
  return !value
}

// authoritative curry; falsy path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is falsy.
 *
 * @example
 *   type User = { disabled?: boolean | 0 | "" }
 *   const isDisabledFalsy = propIsFalsy<User>("disabled")
 */
export function propIsFalsy<T, Path extends SelectorPath<T> = SelectorPath<T>>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & Falsy>
    : never
  : never

// generic curry; falsy path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is falsy.
 *
 * @example
 *   const values = [{ disabled: true }, { disabled: false }]
 *   values.filter(propIsFalsy("disabled")) // [{ disabled: false }]
 */
export function propIsFalsy<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & Falsy>
    : never
  : never
export function propIsFalsy(path: string) {
  return (value: unknown) => isFalsy(getPropertyPathValue(value, path))
}

export function isUndefined<T>(
  value: T,
): value is Extract<T, undefined | void> {
  return value === undefined
}

// authoritative curry; undefined path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is undefined.
 *
 * @example
 *   type User = { email?: string }
 *   const isMissingEmail = propIsUndefined<User>("email")
 */
export function propIsUndefined<
  T,
  Path extends SelectorPath<T> = SelectorPath<T>,
>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Extract<Get<T, Path>, undefined | void>>
    : never
  : never

// generic curry; undefined path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is undefined.
 *
 * @example
 *   const values = [{ email: "ada@example.com" }, {}]
 *   values.filter(propIsUndefined("email")) // [{}]
 */
export function propIsUndefined<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Extract<Get<T, Path>, undefined | void>>
    : never
  : never
export function propIsUndefined(path: string) {
  return (value: unknown) => isUndefined(getPropertyPathValue(value, path))
}

export function isDefined<T>(value: T): value is Exclude<T, undefined | void> {
  return value !== undefined
}

// authoritative curry; defined path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is not undefined.
 *
 * @example
 *   type User = { email?: string | null }
 *   const hasEmailProperty = propIsDefined<User>("email")
 */
export function propIsDefined<
  T,
  Path extends SelectorPath<T> = SelectorPath<T>,
>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Exclude<Get<T, Path>, undefined | void>>
    : never
  : never

// generic curry; defined path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is not undefined.
 *
 * @example
 *   const values = [{ email: "ada@example.com" }, {}]
 *   values.filter(propIsDefined("email")) // [{ email: "ada@example.com" }]
 */
export function propIsDefined<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Exclude<Get<T, Path>, undefined | void>>
    : never
  : never
export function propIsDefined(path: string) {
  return (value: unknown) => isDefined(getPropertyPathValue(value, path))
}

// authoritative; readonly array guard
/**
 * Checks whether the value is an array while preserving an existing readonly
 * array type.
 *
 * @example
 *   const value = [1, 2] as const
 *   isReadonlyArray(value) // true
 */
export function isReadonlyArray<T extends readonly unknown[]>(
  value: T,
): value is T

// generic; readonly array guard
/**
 * Checks whether the value is an array and narrows it to a readonly array.
 *
 * @example
 *   const value: unknown = [1, 2]
 *   isReadonlyArray(value) // true
 */
export function isReadonlyArray(value: unknown): value is readonly unknown[]
export function isReadonlyArray(value: unknown) {
  return Array.isArray(value)
}

export function isPlainObject<T>(
  value: T,
): value is T & Record<PropertyKey, unknown> {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

// authoritative curry; plain-object path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is a plain object.
 *
 * @example
 *   type User = { payload?: unknown }
 *   const hasPayloadObject = propIsPlainObject<User>("payload")
 */
export function propIsPlainObject<
  T,
  Path extends SelectorPath<T> = SelectorPath<T>,
>(
  path: Path,
): (
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & Record<PropertyKey, unknown>>
    : never
  : never

// generic curry; plain-object path guard
/**
 * Returns a type guard that checks whether the property denoted by the path
 * selector is a plain object.
 *
 * @example
 *   const values = [{ payload: { source: "test" } }, { payload: null }]
 *   values.filter(propIsPlainObject("payload")) // [{ payload: { source: "test" } }]
 */
export function propIsPlainObject<Path extends string>(
  path: Path,
): <T>(
  value: T,
) => value is T extends unknown
  ? Path extends SelectorPath<T>
    ? T & PathSatisfier<Path, Get<T, Path> & Record<PropertyKey, unknown>>
    : never
  : never
export function propIsPlainObject(path: string) {
  return (value: unknown) => isPlainObject(getPropertyPathValue(value, path))
}

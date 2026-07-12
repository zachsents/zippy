export type Falsy = false | 0 | 0n | "" | null | undefined
export type Truthy<T> = Exclude<T, Falsy>

export function isNullish<T>(value: T): value is T & (null | undefined) {
  return value === null || value === undefined
}

export function isNonNullish<T>(value: T): value is NonNullable<T> {
  return !isNullish(value)
}

export function isTruthy<T>(value: T): value is Truthy<T> {
  return Boolean(value)
}

export function isFalsy<T>(value: T): value is T & Falsy {
  return !value
}

export function isUndefined<T>(
  value: T,
): value is Extract<T, undefined | void> {
  return value === undefined
}

export function isDefined<T>(value: T): value is Exclude<T, undefined | void> {
  return value !== undefined
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

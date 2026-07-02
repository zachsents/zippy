export type Falsy = false | 0 | 0n | "" | null | undefined

export type Truthy<T> = Exclude<T, Falsy>

export type PlainObject = Record<PropertyKey, unknown>

export function isNullish<T>(value: T): value is T & (null | undefined) {
  return value === null || value === undefined
}

export function isTruthy<T>(value: T): value is Truthy<T> {
  return Boolean(value)
}

export function isFalsy<T>(value: T): value is T & Falsy {
  return !value
}

export function isUndefined<T>(value: T): value is T & undefined {
  return value === undefined
}

export function isNull<T>(value: T): value is T & null {
  return value === null
}

export function isPlainObject<T>(value: T): value is T & PlainObject {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

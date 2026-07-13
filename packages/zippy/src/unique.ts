import { isReadonlyArray } from "./guards"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

// authoritative pipe curry; path
/**
 * Returns a function that keeps the first value for each unique property path
 * value.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique("id")(data) // [{ id: 1, name: "first" }]
 */
export function unique<T>(
  selector: SelectorPath<T>,
): (values: readonly T[]) => T[]

// generic curry; path
/**
 * Returns a function that keeps the first value for each unique property path
 * value.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique("id")(data) // [{ id: 1, name: "first" }]
 */
export function unique<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path>>(values: readonly T[]) => T[]

// authoritative pipe curry; selector fn
/**
 * Returns a function that keeps the first value for each unique key returned by
 * the selector function.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique((x) => x.id)(data) // [{ id: 1, name: "first" }]
 */
export function unique<T>(
  selector: SelectorFunction<NoInfer<T>>,
): (values: readonly T[]) => T[]

// generic curry; selector fn
/**
 * Returns a function that keeps the first value for each unique key returned by
 * the selector function.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique((x) => x.id)(data) // [{ id: 1, name: "first" }]
 */
export function unique<T>(
  selector: SelectorFunction<T>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => U[]

// normal; path
/**
 * Keeps the first value for each unique property path value.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique(data, "id") // [{ id: 1, name: "first" }]
 */
export function unique<T>(values: readonly T[], selector: SelectorPath<T>): T[]

// normal; selector fn
/**
 * Keeps the first value for each unique key returned by the selector function.
 *
 * @example
 *   const data = [
 *     { id: 1, name: "first" },
 *     { id: 1, name: "duplicate" },
 *   ]
 *   unique(data, (x) => x.id) // [{ id: 1, name: "first" }]
 */
export function unique<T>(
  values: readonly T[],
  selector: SelectorFunction<T>,
): T[]

// normal values
/**
 * Keeps the first occurrence of each value in the passed array.
 *
 * @example
 *   unique([1, 2, 1, 3]) // [1, 2, 3]
 */
export function unique<T>(values: readonly T[]): T[]

// curried values
/**
 * Returns a function that keeps the first occurrence of each value in the
 * passed array.
 *
 * @example
 *   unique()([1, 2, 1, 3]) // [1, 2, 3]
 */
export function unique(): <T>(values: readonly T[]) => T[]

export function unique(
  ...args:
    | []
    | [readonly unknown[]]
    | [string | SelectorFunction<unknown>]
    | [values: readonly unknown[], selector: string | SelectorFunction<unknown>]
) {
  if (args.length === 0) {
    return (values: []) => uniqueImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isReadonlyArray(a)
      ? uniqueImpl(a)
      : (values: []) => uniqueImpl(values, a)
  }

  return uniqueImpl(...args)
}

function uniqueImpl<T>(
  values: readonly T[],
  selector: string | SelectorFunction<T> = (value) => value,
) {
  const seenKeys = new Set<unknown>()
  const result: T[] = []

  for (const [index, value] of values.entries()) {
    const key =
      typeof selector === "string"
        ? getPropertyPathValue(value, selector)
        : selector(value, index, values)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

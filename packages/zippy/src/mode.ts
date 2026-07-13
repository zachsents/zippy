import { isReadonlyArray } from "./guards"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type Selector,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

// authoritative pipe curry; path
/**
 * Returns a function that finds the first value with the most common key
 * denoted by the path selector.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode("kind")(data) // { kind: "a" }
 */
export function mode<T>(
  selector: SelectorPath<T>,
): (values: readonly T[]) => T | undefined

// generic curry; path
/**
 * Returns a function that finds the first value with the most common key
 * denoted by the path selector.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode("kind")(data) // { kind: "a" }
 */
export function mode<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path>>(values: readonly T[]) => T | undefined

// authoritative pipe curry; selector fn
/**
 * Returns a function that finds the first value with the most common key
 * returned by the selector function.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode((x) => x.kind)(data) // { kind: "a" }
 */
export function mode<T>(
  selector: SelectorFunction<NoInfer<T>>,
): (values: readonly T[]) => T | undefined

// generic curry; selector fn
/**
 * Returns a function that finds the first value with the most common key
 * returned by the selector function.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode((x) => x.kind)(data) // { kind: "a" }
 */
export function mode<T>(
  selector: SelectorFunction<T>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => U | undefined

// normal; path
/**
 * Finds the first value with the most common key denoted by the path selector.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode(data, "kind") // { kind: "a" }
 */
export function mode<T>(
  values: readonly T[],
  selector: SelectorPath<T>,
): T | undefined

// normal; selector fn
/**
 * Finds the first value with the most common key returned by the selector
 * function.
 *
 * @example
 *   const data = [{ kind: "a" }, { kind: "b" }, { kind: "a" }]
 *   mode(data, (x) => x.kind) // { kind: "a" }
 */
export function mode<T>(
  values: readonly T[],
  selector: SelectorFunction<T>,
): T | undefined

// normal values
/**
 * Finds the most common value in the passed array.
 *
 * @example
 *   const data = ["z", "i", "p", "p", "y"]
 *   mode(data) // "p"
 */
export function mode<T>(values: readonly T[]): T | undefined

// curried values
/**
 * Returns a function that finds the most common value in the passed array.
 *
 * @example
 *   const data = ["z", "i", "p", "p", "y"]
 *   mode()(data) // "p"
 */
export function mode(): <T>(values: readonly T[]) => T | undefined

export function mode(
  ...args:
    | []
    | [readonly unknown[]]
    | [Selector<unknown>]
    | [values: readonly unknown[], selector: Selector<unknown>]
) {
  if (args.length === 0) {
    return (values: []) => modeImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isReadonlyArray(a)
      ? modeImpl(a)
      : (values: []) => modeImpl(values, a)
  }

  return modeImpl(...args)
}

function modeImpl(
  values: readonly unknown[],
  selector?: string | SelectorFunction<unknown>,
) {
  const counts = new Map<unknown, number>()
  const firstValues = new Map<unknown, unknown>()
  const orderedKeys: unknown[] = []

  for (const [index, value] of values.entries()) {
    const key =
      selector === undefined
        ? value
        : typeof selector === "string"
          ? getPropertyPathValue(value, selector)
          : selector(value, index, values)
    const count = counts.get(key)

    if (count === undefined) {
      counts.set(key, 1)
      firstValues.set(key, value)
      orderedKeys.push(key)
    } else {
      counts.set(key, count + 1)
    }
  }

  let bestValue: unknown
  let bestCount = 0

  for (const key of orderedKeys) {
    const count = counts.get(key)

    if (count !== undefined && count > bestCount) {
      bestValue = firstValues.get(key)
      bestCount = count
    }
  }

  return bestValue
}

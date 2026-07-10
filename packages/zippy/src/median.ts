import { isReadonlyArray } from "./is-readonly-array"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type Selector,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

// authoritative pipe curry; path
/**
 * Returns a function that finds the median of the values in the passed array by
 * accessing the property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median("a.num")(data) // 8.5
 */
export function median<T>(
  selector: SelectorPath<T, number>,
): (values: readonly T[]) => number | undefined

// generic curry; path
/**
 * Returns a function that finds the median of the values in the passed array by
 * accessing the property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median("a.num")(data) // 8.5
 */
export function median<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path, number>>(
  values: readonly T[],
) => number | undefined

// authoritative pipe curry; selector fn
/**
 * Returns a function that finds the median of the values in the passed array by
 * accessing the property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median((x) => x.a.num)(data) // 8.5
 */
export function median<T>(
  selector: SelectorFunction<NoInfer<T>, number>,
): (values: readonly T[]) => number | undefined

// generic curry; selector fn
/**
 * Returns a function that finds the median of the values in the passed array by
 * accessing the property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median((x) => x.a.num)(data) // 8.5
 */
export function median<T>(
  selector: SelectorFunction<T, number>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => number | undefined

// normal; path
/**
 * Finds the median of the values in the passed array by accessing the property
 * denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median(data, "a.num") // 8.5
 */
export function median<T>(
  values: readonly T[],
  selector: SelectorPath<T, number>,
): number | undefined

// normal; selector fn
/**
 * Finds the median of the values in the passed array by accessing the property
 * returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   median(data, (x) => x.a.num) // 8.5
 */
export function median<T>(
  values: readonly T[],
  selector: SelectorFunction<T, number>,
): number | undefined

// normal numbers
/**
 * Finds the median of the passed array.
 *
 * @example
 *   const data = [5, 12]
 *   median(data) // 8.5
 */
export function median(values: readonly number[]): number | undefined

// curried numbers
/**
 * Returns a function that finds the median of the values in the passed array.
 *
 * @example
 *   const data = [5, 12]
 *   median()(data) // 8.5
 */
export function median(): (values: readonly number[]) => number | undefined

export function median(
  ...args:
    | []
    | [readonly number[]]
    | [Selector<unknown, number>]
    | [values: readonly unknown[], selector: Selector<unknown, number>]
) {
  if (args.length === 0) {
    return (values: []) => medianImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isReadonlyArray(a)
      ? medianImpl(a)
      : (values: []) => medianImpl(values, a)
  }

  return medianImpl(...args)
}

function medianImpl(
  values: readonly unknown[],
  selector: string | SelectorFunction<unknown, number> = Number,
) {
  if (values.length === 0) {
    return undefined
  }

  const sorted = values
    .map((value, index, source) =>
      typeof selector === "string"
        ? Number(getPropertyPathValue(value, selector))
        : selector(value, index, source),
    )
    .toSorted((left, right) => left - right)

  const midpoint = Math.floor(sorted.length / 2)
  const right = sorted[midpoint]

  if (right === undefined) {
    return undefined
  }

  if (sorted.length % 2 === 1) {
    return right
  }

  const left = sorted[midpoint - 1]

  return left === undefined ? undefined : (left + right) / 2
}

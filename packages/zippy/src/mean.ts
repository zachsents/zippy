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
 * Returns a function that averages the values in the passed array by accessing
 * the property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean("a.num")(data) // 10
 */
export function mean<T>(
  selector: SelectorPath<T, number>,
): (values: readonly T[]) => number | undefined

// generic curry; path
/**
 * Returns a function that averages the values in the passed array by accessing
 * the property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean("a.num")(data) // 10
 */
export function mean<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path, number>>(
  values: readonly T[],
) => number | undefined

// authoritative pipe curry; selector fn
/**
 * Returns a function that averages the values in the passed array by accessing
 * the property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean((x) => x.a.num)(data) // 10
 */
export function mean<T>(
  selector: SelectorFunction<NoInfer<T>, number>,
): (values: readonly T[]) => number | undefined

// generic curry; selector fn
/**
 * Returns a function that averages the values in the passed array by accessing
 * the property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean((x) => x.a.num)(data) // 10
 */
export function mean<T>(
  selector: SelectorFunction<T, number>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => number | undefined

// normal; path
/**
 * Averages the values in the passed array by accessing the property denoted by
 * the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean(data, "a.num") // 10
 */
export function mean<T>(
  values: readonly T[],
  selector: SelectorPath<T, number>,
): number | undefined

// normal; selector fn
/**
 * Averages the values in the passed array by accessing the property returned by
 * the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 15 } }]
 *   mean(data, (x) => x.a.num) // 10
 */
export function mean<T>(
  values: readonly T[],
  selector: SelectorFunction<T, number>,
): number | undefined

// normal numbers
/**
 * Averages the passed array.
 *
 * @example
 *   const data = [5, 15]
 *   mean(data) // 10
 */
export function mean(values: readonly number[]): number | undefined

// curried numbers
/**
 * Returns a function that averages the values in the passed array.
 *
 * @example
 *   const data = [5, 15]
 *   mean()(data) // 10
 */
export function mean(): (values: readonly number[]) => number | undefined

export function mean(
  ...args:
    | []
    | [readonly number[]]
    | [Selector<unknown, number>]
    | [values: readonly unknown[], selector: Selector<unknown, number>]
) {
  if (args.length === 0) {
    return (values: []) => meanImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isReadonlyArray(a)
      ? meanImpl(a)
      : (values: []) => meanImpl(values, a)
  }

  return meanImpl(...args)
}

function meanImpl(
  values: readonly unknown[],
  selector: string | SelectorFunction<unknown, number> = Number,
) {
  if (values.length === 0) {
    return undefined
  }

  return (
    values.reduce<number>(
      (sum, cur, i, arr) =>
        sum +
        (typeof selector === "string"
          ? Number(getPropertyPathValue(cur, selector))
          : selector(cur, i, arr)),
      0,
    ) / values.length
  )
}

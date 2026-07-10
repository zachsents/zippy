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
 * Returns a function that sums the values in the passed array by accessing the
 * property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum("a.num")(data) // 17
 */
export function sum<T>(
  selector: SelectorPath<T, number>,
): (values: readonly T[]) => number

// generic curry; path
/**
 * Returns a function that sums the values in the passed array by accessing the
 * property denoted by the path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum("a.num")(data) // 17
 */
export function sum<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path, number>>(values: readonly T[]) => number

// authoritative pipe curry; selector fn
/**
 * Returns a function that sums the values in the passed array by accessing the
 * property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum((x) => x.a.num)(data) // 17
 */
export function sum<T>(
  selector: SelectorFunction<NoInfer<T>, number>,
): (values: readonly T[]) => number

// generic curry; selector fn
/**
 * Returns a function that sums the values in the passed array by accessing the
 * property returned by the selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum((x) => x.a.num)(data) // 17
 */
export function sum<T>(
  selector: SelectorFunction<T, number>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => number

// normal; path
/**
 * Sums the values in the passed array by accessing the property denoted by the
 * path selector.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum(data, "a.num") // 17
 */
export function sum<T>(
  values: readonly T[],
  selector: SelectorPath<T, number>,
): number

// normal; selector fn
/**
 * Sums the values in the passed array by accessing the property returned by the
 * selector function.
 *
 * @example
 *   const data = [{ a: { num: 5 } }, { a: { num: 12 } }]
 *   sum(data, (x) => x.a.num) // 17
 */
export function sum<T>(
  values: readonly T[],
  selector: SelectorFunction<T, number>,
): number

// normal numbers
/**
 * Sums the passed array.
 *
 * @example
 *   const data = [5, 12]
 *   sum(data) // 17
 */
export function sum(values: readonly number[]): number

// curried numbers
/**
 * Returns a function that sums the values in the passed array.
 *
 * @example
 *   const data = [5, 12]
 *   sum()(data) // 17
 */
export function sum(): (values: readonly number[]) => number

export function sum(
  ...args:
    | []
    | [readonly number[]]
    | [Selector<unknown, number>]
    | [values: readonly unknown[], selector: Selector<unknown, number>]
) {
  if (args.length === 0) {
    return (values: []) => sumImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isReadonlyArray(a) ? sumImpl(a) : (values: []) => sumImpl(values, a)
  }

  return sumImpl(...args)
}

function sumImpl(
  values: readonly unknown[],
  selector: string | SelectorFunction<unknown, number> = Number,
) {
  return values.reduce<number>(
    (sum, cur, i, arr) =>
      sum +
      (typeof selector === "string"
        ? Number(getPropertyPathValue(cur, selector))
        : selector(cur, i, arr)),
    0,
  )
}

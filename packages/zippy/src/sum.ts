import {
  isIterableInput,
  type IterableInput,
  toReadonlyArray,
} from "./iterable"
import {
  getPropertyPathValue,
  type PathSatisfier,
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
): (values: IterableInput<T>) => number

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
<T extends PathSatisfier<Path, number>>(values: IterableInput<T>) => number

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
): (values: IterableInput<T>) => number

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
<U extends T>(values: IterableInput<U>) => number

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
  values: IterableInput<T>,
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
  values: IterableInput<T>,
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
export function sum(values: IterableInput<number>): number

// curried numbers
/**
 * Returns a function that sums the values in the passed array.
 *
 * @example
 *   const data = [5, 12]
 *   sum()(data) // 17
 */
export function sum(): (values: IterableInput<number>) => number

export function sum(
  ...args:
    | []
    | [IterableInput<number>]
    | [string | SelectorFunction<unknown, number>]
    | [
        values: IterableInput<unknown>,
        selector: string | SelectorFunction<unknown, number>,
      ]
) {
  if (args.length === 0) {
    return (values: []) => sumImpl(values)
  }

  if (args.length === 1) {
    const [a] = args
    return isIterableInput(a) ? sumImpl(a) : (values: []) => sumImpl(values, a)
  }

  return sumImpl(...args)
}

function sumImpl(
  values: IterableInput<unknown>,
  selector: string | SelectorFunction<unknown, number> = Number,
) {
  const source = toReadonlyArray(values)

  return source.reduce<number>(
    (sum, cur, i, arr) =>
      sum +
      (typeof selector === "string"
        ? Number(getPropertyPathValue(cur, selector))
        : selector(cur, i, arr)),
    0,
  )
}

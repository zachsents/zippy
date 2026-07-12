import { isReadonlyArray } from "./is-readonly-array"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

type SelectorInput<TSelector> = TSelector extends (
  value: infer Value,
  ...args: unknown[]
) => unknown
  ? Value
  : never

// authoritative pipe curry; path
/**
 * Returns a function that finds values from the passed array that do not appear
 * in the compared array by accessing the property denoted by the path
 * selector.
 *
 * @example
 *   const data = [{ id: 1 }, { id: 2 }]
 *   difference([{ id: 2 }], "id")(data) // [{ id: 1 }]
 */
export function difference<Value, Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): (values: readonly Value[]) => Value[]

// generic curry; path
/**
 * Returns a function that finds values from the passed array that do not appear
 * in the compared array by accessing the property denoted by the path
 * selector.
 *
 * @example
 *   const data = [{ id: 1 }, { id: 2 }]
 *   difference([{ id: 2 }], "id")(data) // [{ id: 1 }]
 */
export function difference<Path extends string>(
  comparedValues: readonly PathSatisfier<Path>[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends PathSatisfier<Path>>(values: readonly Value[]) => Value[]

// authoritative pipe curry; selector fn
/**
 * Returns a function that finds values from the passed array that do not appear
 * in the compared array by accessing the property returned by the selector
 * function.
 *
 * @example
 *   const data = [{ id: 1 }, { id: 2 }]
 *   difference([{ id: 2 }], (x) => x.id)(data) // [{ id: 1 }]
 */
export function difference<Value, Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorFunction<NoInfer<Value | Compared>>,
): (values: readonly Value[]) => Value[]

// generic curry; selector fn
/**
 * Returns a function that finds values from the passed array that do not appear
 * in the compared array by accessing the property returned by the selector
 * function.
 *
 * @example
 *   const data = [{ id: 1 }, { id: 2 }]
 *   difference([{ id: 2 }], (x) => x.id)(data) // [{ id: 1 }]
 */
export function difference<
  TSelector extends (value: never, ...args: unknown[]) => unknown,
>(
  comparedValues: readonly NoInfer<SelectorInput<TSelector>>[],
  selector: TSelector,
): <Value extends SelectorInput<TSelector>>(values: readonly Value[]) => Value[]

// normal; path
/**
 * Finds values that do not appear in the compared array by accessing the
 * property denoted by the path selector.
 *
 * @example
 *   difference([{ id: 1 }, { id: 2 }], [{ id: 2 }], "id") // [{ id: 1 }]
 */
export function difference<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): Value[]

// normal; selector fn
/**
 * Finds values that do not appear in the compared array by accessing the
 * property returned by the selector function.
 *
 * @example
 *   difference([{ id: 1 }, { id: 2 }], [{ id: 2 }], (x) => x.id) // [{ id: 1 }]
 */
export function difference<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared>,
): Value[]

// normal values
/**
 * Finds the unique values from the passed array that do not appear in any of
 * the excluded arrays.
 *
 * @example
 *   difference([1, 2, 2, 3], [2]) // [1, 3]
 */
export function difference<T>(
  values: readonly T[],
  excludedValues: readonly NoInfer<T>[],
  ...excludedArrays: Array<readonly NoInfer<T>[]>
): T[]

// curried values
/**
 * Returns a function that finds the unique values from the passed array that do
 * not appear in the excluded array.
 *
 * @example
 *   difference([2])([1, 2, 2, 3]) // [1, 3]
 */
export function difference<Excluded>(
  excludedValues: readonly Excluded[],
): <T>(values: readonly T[] & (Excluded extends T ? unknown : never)) => T[]

export function difference(
  a: readonly unknown[],
  b?: readonly unknown[] | string | SelectorFunction<unknown>,
  c?: readonly unknown[] | string | SelectorFunction<unknown>,
  ...rest: Array<readonly unknown[]>
) {
  if (b === undefined) {
    return (values: []) => differenceImpl<unknown>(values, [a])
  }

  if (!isReadonlyArray(b)) {
    return (values: []) => differenceImpl<unknown>(values, [a], b)
  }

  if (c === undefined) {
    return differenceImpl(a, [b])
  }

  return isReadonlyArray(c)
    ? differenceImpl(a, [b, c, ...rest])
    : differenceImpl(a, [b], c)
}

function differenceImpl<T>(
  values: readonly T[],
  comparedArrays: Array<readonly unknown[]>,
  selector?: string | SelectorFunction<unknown>,
) {
  const comparedKeys = new Set<unknown>()
  const seenKeys = new Set<unknown>()
  const result: T[] = []

  for (const comparedValues of comparedArrays) {
    for (const [index, value] of comparedValues.entries()) {
      comparedKeys.add(
        selector === undefined
          ? value
          : typeof selector === "string"
            ? getPropertyPathValue(value, selector)
            : selector(value, index, comparedValues),
      )
    }
  }

  for (const [index, value] of values.entries()) {
    const key =
      selector === undefined
        ? value
        : typeof selector === "string"
          ? getPropertyPathValue(value, selector)
          : selector(value, index, values)

    if (!comparedKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

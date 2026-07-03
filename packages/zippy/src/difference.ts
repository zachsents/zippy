import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"
import { unique } from "./unique"

function toSet<T>(arrays: Iterable<readonly T[]>): Set<T> {
  const result = new Set<T>()

  for (const values of arrays) {
    for (const value of values) {
      result.add(value)
    }
  }

  return result
}

export function difference<T>(
  values: readonly T[],
  excludedValues: readonly unknown[],
  ...excludedArrays: Array<readonly unknown[]>
): T[]
export function difference(
  excludedValues: readonly unknown[],
): <T>(values: readonly T[]) => T[]
export function difference<T>(
  ...args:
    | [
        values: readonly T[],
        excludedValues: readonly unknown[],
        ...excludedArrays: Array<readonly unknown[]>,
      ]
    | [excludedValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [excludedValues] = args

    return <InputValue>(values: readonly InputValue[]) =>
      difference(values, excludedValues)
  }

  const [values, ...excludedArrays] = args
  const excluded = toSet(excludedArrays)

  return unique(values).filter((value) => !excluded.has(value))
}

function differenceByValues<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | string,
) {
  const comparedKeys = new Set<unknown>()
  const seenKeys = new Set<unknown>()
  const result: Value[] = []

  for (const [index, value] of comparedValues.entries()) {
    comparedKeys.add(selectValue(selector, value, index, comparedValues))
  }

  for (const [index, value] of values.entries()) {
    const key = selectValue(selector, value, index, values)

    if (!comparedKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

export function differenceBy<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | PropertyPath<Value | Compared>,
): Value[]
export function differenceBy<Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Compared> | PropertyPath<Compared>,
): <Value extends Compared>(values: readonly Value[]) => Value[]
export function differenceBy<const Path extends string, Compared>(
  comparedValues: readonly Compared[] &
    ValidPropertyPath<Compared, Path, unknown>,
  selector: Path,
): <Value extends Compared>(
  values: readonly Value[] & ValidPropertyPath<Value, Path, unknown>,
) => Value[]
export function differenceBy<Value, Compared>(
  ...args:
    | [
        values: readonly Value[],
        comparedValues: readonly Compared[],
        selector: SelectorFunction<Value | Compared> | string,
      ]
    | [
        comparedValues: readonly Compared[],
        selector: SelectorFunction<Compared> | string,
      ]
) {
  if (args.length === 2) {
    const [comparedValues, selector] = args

    return <InputValue extends Compared>(values: readonly InputValue[]) =>
      differenceByValues(values, comparedValues, selector)
  }

  const [values, comparedValues, selector] = args

  return differenceByValues(values, comparedValues, selector)
}

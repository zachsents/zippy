import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"
import { unique } from "./unique"

export function intersection<T>(
  values: readonly T[],
  otherValues: readonly unknown[],
  ...otherArrays: Array<readonly unknown[]>
): T[]
export function intersection(
  otherValues: readonly unknown[],
): <T>(values: readonly T[]) => T[]
export function intersection<T>(
  ...args:
    | [
        values: readonly T[],
        otherValues: readonly unknown[],
        ...otherArrays: Array<readonly unknown[]>,
      ]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return <InputValue>(values: readonly InputValue[]) =>
      intersection(values, otherValues)
  }

  const [values, ...otherArrays] = args
  const otherSets = otherArrays.map((otherValues) => new Set(otherValues))

  return unique(values).filter((value) =>
    otherSets.every((otherSet) => otherSet.has(value)),
  )
}

function intersectionByValues<Value, Compared>(
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

    if (comparedKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

export function intersectionBy<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | PropertyPath<Value | Compared>,
): Value[]
export function intersectionBy<Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Compared> | PropertyPath<Compared>,
): <Value extends Compared>(values: readonly Value[]) => Value[]
export function intersectionBy<const Path extends string, Compared>(
  comparedValues: readonly Compared[] &
    ValidPropertyPath<Compared, Path, unknown>,
  selector: Path,
): <Value extends Compared>(
  values: readonly Value[] & ValidPropertyPath<Value, Path, unknown>,
) => Value[]
export function intersectionBy<Value, Compared>(
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
      intersectionByValues(values, comparedValues, selector)
  }

  const [values, comparedValues, selector] = args

  return intersectionByValues(values, comparedValues, selector)
}

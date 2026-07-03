import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

type ArrayValue<T> = T extends readonly (infer Value)[] ? Value : never

function toSet<T>(arrays: Iterable<readonly T[]>): Set<T> {
  const result = new Set<T>()

  for (const values of arrays) {
    for (const value of values) {
      result.add(value)
    }
  }

  return result
}

export function union<T, U, Rest extends Array<readonly unknown[]>>(
  values: readonly T[],
  otherValues: readonly U[],
  ...otherArrays: Rest
): Array<T | U | ArrayValue<Rest[number]>>
export function union<U>(
  otherValues: readonly U[],
): <T>(values: readonly T[]) => Array<T | U>
export function union(
  ...arrays:
    | [
        values: readonly unknown[],
        otherValues: readonly unknown[],
        ...otherArrays: Array<readonly unknown[]>,
      ]
    | [otherValues: readonly unknown[]]
) {
  if (arrays.length === 1) {
    const [otherValues] = arrays

    return (values: readonly unknown[]) => union(values, otherValues)
  }

  return Array.from(toSet(arrays))
}

function unionByValues<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right> | string,
) {
  const seenKeys = new Set<unknown>()
  const result: Array<Left | Right> = []

  for (const [index, value] of leftValues.entries()) {
    const key = selectValue(selector, value, index, leftValues)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  for (const [index, value] of rightValues.entries()) {
    const key = selectValue(selector, value, index, rightValues)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

export function unionBy<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right> | PropertyPath<Left | Right>,
): Array<Left | Right>
export function unionBy<Right>(
  rightValues: readonly Right[],
  selector: SelectorFunction<Right> | PropertyPath<Right>,
): <Left extends Right>(leftValues: readonly Left[]) => Array<Left | Right>
export function unionBy<const Path extends string, Right>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  selector: Path,
): <Left extends Right>(
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Array<Left | Right>
export function unionBy<Left, Right>(
  ...args:
    | [
        leftValues: readonly Left[],
        rightValues: readonly Right[],
        selector: SelectorFunction<Left | Right> | string,
      ]
    | [
        rightValues: readonly Right[],
        selector: SelectorFunction<Right> | string,
      ]
) {
  if (args.length === 2) {
    const [rightValues, selector] = args

    return <InputLeft extends Right>(leftValues: readonly InputLeft[]) =>
      unionByValues(leftValues, rightValues, selector)
  }

  const [leftValues, rightValues, selector] = args

  return unionByValues(leftValues, rightValues, selector)
}

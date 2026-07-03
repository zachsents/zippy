import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"
import { unique } from "./unique"

export function symmetricDifference<T, U>(
  left: readonly T[],
  right: readonly U[],
): Array<T | U>
export function symmetricDifference<U>(
  right: readonly U[],
): <T>(left: readonly T[]) => Array<T | U>
export function symmetricDifference<T, U>(
  ...args: [left: readonly T[], right: readonly U[]] | [right: readonly U[]]
) {
  if (args.length === 1) {
    const [right] = args

    return <InputLeft>(left: readonly InputLeft[]) =>
      symmetricDifference(left, right)
  }

  const [left, right] = args
  const leftSet = new Set<unknown>(left)
  const rightSet = new Set<unknown>(right)

  return [
    ...unique(left).filter((value) => !rightSet.has(value)),
    ...unique(right).filter((value) => !leftSet.has(value)),
  ]
}

function symmetricDifferenceByValues<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right> | string,
) {
  const leftKeys = new Set<unknown>()
  const rightKeys = new Set<unknown>()
  const seenKeys = new Set<unknown>()
  const result: Array<Left | Right> = []

  for (const [index, value] of leftValues.entries()) {
    leftKeys.add(selectValue(selector, value, index, leftValues))
  }

  for (const [index, value] of rightValues.entries()) {
    rightKeys.add(selectValue(selector, value, index, rightValues))
  }

  for (const [index, value] of leftValues.entries()) {
    const key = selectValue(selector, value, index, leftValues)

    if (!rightKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  for (const [index, value] of rightValues.entries()) {
    const key = selectValue(selector, value, index, rightValues)

    if (!leftKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

export function symmetricDifferenceBy<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right> | PropertyPath<Left | Right>,
): Array<Left | Right>
export function symmetricDifferenceBy<Right>(
  rightValues: readonly Right[],
  selector: SelectorFunction<Right> | PropertyPath<Right>,
): <Left extends Right>(leftValues: readonly Left[]) => Array<Left | Right>
export function symmetricDifferenceBy<const Path extends string, Right>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  selector: Path,
): <Left extends Right>(
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Array<Left | Right>
export function symmetricDifferenceBy<Left, Right>(
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
      symmetricDifferenceByValues(leftValues, rightValues, selector)
  }

  const [leftValues, rightValues, selector] = args

  return symmetricDifferenceByValues(leftValues, rightValues, selector)
}

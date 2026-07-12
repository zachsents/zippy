import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"
import { unique } from "./unique"

type RuntimeSelector = string | SelectorFunction<unknown>

function isRuntimeSelector(value: unknown): value is RuntimeSelector {
  return typeof value === "string" || typeof value === "function"
}

function invalidArguments(): unknown {
  throw new TypeError("Invalid arguments")
}

function selectKey(
  selector: RuntimeSelector,
  value: unknown,
  index: number,
  values: readonly unknown[],
) {
  return typeof selector === "string"
    ? getPropertyPathValue(value, selector)
    : selector(value, index, values)
}

function symmetricDifferenceImpl(
  left: readonly unknown[],
  right: readonly unknown[],
) {
  const leftSet = new Set<unknown>(left)
  const rightSet = new Set<unknown>(right)

  return [
    ...unique(left).filter((value) => !rightSet.has(value)),
    ...unique(right).filter((value) => !leftSet.has(value)),
  ]
}

function symmetricDifferenceByImpl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const leftKeys = new Set<unknown>()
  const rightKeys = new Set<unknown>()
  const seenKeys = new Set<unknown>()
  const result: unknown[] = []

  for (const [index, value] of leftValues.entries()) {
    leftKeys.add(selectKey(selector, value, index, leftValues))
  }

  for (const [index, value] of rightValues.entries()) {
    rightKeys.add(selectKey(selector, value, index, rightValues))
  }

  for (const [index, value] of leftValues.entries()) {
    const key = selectKey(selector, value, index, leftValues)

    if (!rightKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  for (const [index, value] of rightValues.entries()) {
    const key = selectKey(selector, value, index, rightValues)

    if (!leftKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

// authoritative pipe curry; path
export function symmetricDifference<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): (leftValues: readonly Left[]) => Array<Left | Right>

// generic curry; path
export function symmetricDifference<
  Path extends string,
  Right extends PathSatisfier<Path>,
>(
  rightValues: readonly Right[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends PathSatisfier<Path>>(
  leftValues: readonly Left[],
) => Array<Left | Right>

// authoritative pipe curry; selector fn
export function symmetricDifference<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorFunction<NoInfer<Left | Right>>,
): (leftValues: readonly Left[]) => Array<Left | Right>

// generic curry; selector fn
export function symmetricDifference<Shape, Right extends Shape>(
  rightValues: readonly Right[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends Shape>(leftValues: readonly Left[]) => Array<Left | Right>

// normal; path
export function symmetricDifference<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): Array<Left | Right>

// normal; selector fn
export function symmetricDifference<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right>,
): Array<Left | Right>

// normal values
export function symmetricDifference<T, U>(
  left: readonly T[],
  right: readonly U[],
): Array<T | U>

// curried values
export function symmetricDifference<U>(
  right: readonly U[],
): <T>(left: readonly T[]) => Array<T | U>

export function symmetricDifference(
  ...args:
    | [right: readonly unknown[]]
    | [rightValues: readonly unknown[], selector: RuntimeSelector]
    | [
        leftValues: readonly unknown[],
        rightValues: readonly unknown[],
        selector?: RuntimeSelector,
      ]
) {
  if (args.length === 1) {
    const [right] = args

    return (left: readonly unknown[]) => symmetricDifferenceImpl(left, right)
  }

  if (args.length === 2) {
    const [rightValues, selector] = args

    if (isRuntimeSelector(selector)) {
      return (leftValues: readonly unknown[]) =>
        symmetricDifferenceByImpl(leftValues, rightValues, selector)
    }
  }

  const [leftValues, rightValues, selector] = args

  if (selector === undefined) {
    return symmetricDifferenceImpl(leftValues, rightValues)
  }

  if (isRuntimeSelector(selector)) {
    return symmetricDifferenceByImpl(leftValues, rightValues, selector)
  }

  return invalidArguments()
}

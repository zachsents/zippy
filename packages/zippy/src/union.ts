import { isReadonlyArray } from "./is-readonly-array"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

type ArrayValue<T> = T extends readonly (infer Value)[] ? Value : never
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

function unionImpl(arrays: Iterable<readonly unknown[]>) {
  const seenValues = new Set<unknown>()
  const result: unknown[] = []

  for (const values of arrays) {
    for (const value of values) {
      if (!seenValues.has(value)) {
        seenValues.add(value)
        result.push(value)
      }
    }
  }

  return result
}

function unionByImpl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const seenKeys = new Set<unknown>()
  const result: unknown[] = []

  for (const [index, value] of leftValues.entries()) {
    const key = selectKey(selector, value, index, leftValues)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  for (const [index, value] of rightValues.entries()) {
    const key = selectKey(selector, value, index, rightValues)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

// authoritative pipe curry; path
export function union<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): (leftValues: readonly Left[]) => Array<Left | Right>

// generic curry; path
export function union<Path extends string, Right extends PathSatisfier<Path>>(
  rightValues: readonly Right[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends PathSatisfier<Path>>(
  leftValues: readonly Left[],
) => Array<Left | Right>

// authoritative pipe curry; selector fn
export function union<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorFunction<NoInfer<Left | Right>>,
): (leftValues: readonly Left[]) => Array<Left | Right>

// generic curry; selector fn
export function union<Shape, Right extends Shape>(
  rightValues: readonly Right[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends Shape>(leftValues: readonly Left[]) => Array<Left | Right>

// normal; path
export function union<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): Array<Left | Right>

// normal; selector fn
export function union<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right>,
): Array<Left | Right>

// normal values
export function union<T, U, Rest extends Array<readonly unknown[]>>(
  values: readonly T[],
  otherValues: readonly U[],
  ...otherArrays: Rest
): Array<T | U | ArrayValue<Rest[number]>>

// curried values
export function union<U>(
  otherValues: readonly U[],
): <T>(values: readonly T[]) => Array<T | U>

export function union(
  ...args:
    | [readonly unknown[]]
    | [rightValues: readonly unknown[], selector: RuntimeSelector]
    | [
        leftValues: readonly unknown[],
        rightValues: readonly unknown[],
        selectorOrOtherValues?: RuntimeSelector | readonly unknown[],
        ...otherArrays: Array<readonly unknown[]>,
      ]
) {
  if (args.length === 1) {
    const [rightValues] = args

    return (leftValues: readonly unknown[]) =>
      unionImpl([leftValues, rightValues])
  }

  if (args.length === 2) {
    const [rightValues, selector] = args

    if (isRuntimeSelector(selector)) {
      return (leftValues: readonly unknown[]) =>
        unionByImpl(leftValues, rightValues, selector)
    }
  }

  const [leftValues, rightValues, selectorOrOtherValues, ...otherArrays] = args

  if (
    selectorOrOtherValues !== undefined &&
    isRuntimeSelector(selectorOrOtherValues)
  ) {
    return unionByImpl(leftValues, rightValues, selectorOrOtherValues)
  }

  if (
    selectorOrOtherValues === undefined ||
    isReadonlyArray(selectorOrOtherValues)
  ) {
    return unionImpl(
      selectorOrOtherValues === undefined
        ? [leftValues, rightValues]
        : [leftValues, rightValues, selectorOrOtherValues, ...otherArrays],
    )
  }

  return invalidArguments()
}

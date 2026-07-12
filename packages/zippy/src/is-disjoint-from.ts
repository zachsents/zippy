import { isReadonlyArray } from "./is-readonly-array"
import {
  getPropertyPathValue,
  type PathSatisfier,
  type SelectorFunction,
  type SelectorPath,
} from "./selector"

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

function selectedKeys(values: readonly unknown[], selector: RuntimeSelector) {
  const result = new Set<unknown>()

  for (const [index, value] of values.entries()) {
    result.add(selectKey(selector, value, index, values))
  }

  return result
}

function isDisjointFromImpl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
) {
  const rightSet = new Set(rightValues)

  return leftValues.every((value) => !rightSet.has(value))
}

function isDisjointFromByImpl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const rightKeys = selectedKeys(rightValues, selector)

  for (const [index, value] of leftValues.entries()) {
    if (rightKeys.has(selectKey(selector, value, index, leftValues))) {
      return false
    }
  }

  return true
}

// authoritative pipe curry; path
export function isDisjointFrom<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): (leftValues: readonly Left[]) => boolean

// generic curry; path
export function isDisjointFrom<
  Path extends string,
  Right extends PathSatisfier<Path>,
>(
  rightValues: readonly Right[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends PathSatisfier<Path>>(leftValues: readonly Left[]) => boolean

// authoritative pipe curry; selector fn
export function isDisjointFrom<Left, Right>(
  rightValues: readonly Right[],
  selector: SelectorFunction<NoInfer<Left | Right>>,
): (leftValues: readonly Left[]) => boolean

// generic curry; selector fn
export function isDisjointFrom<Shape, Right extends Shape>(
  rightValues: readonly Right[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Left extends Shape>(leftValues: readonly Left[]) => boolean

// normal; path
export function isDisjointFrom<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorPath<Left | Right>,
): boolean

// normal; selector fn
export function isDisjointFrom<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  selector: SelectorFunction<Left | Right>,
): boolean

// normal values
export function isDisjointFrom(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
): boolean

// curried values
export function isDisjointFrom(
  rightValues: readonly unknown[],
): (leftValues: readonly unknown[]) => boolean

export function isDisjointFrom(
  ...args:
    | [rightValues: readonly unknown[]]
    | [leftValues: readonly unknown[], rightValues: readonly unknown[]]
    | [rightValues: readonly unknown[], selector: RuntimeSelector]
    | [
        leftValues: readonly unknown[],
        rightValues: readonly unknown[],
        selector: RuntimeSelector,
      ]
) {
  if (args.length === 1) {
    const [rightValues] = args

    return (leftValues: readonly unknown[]) =>
      isDisjointFromImpl(leftValues, rightValues)
  }

  if (args.length === 2) {
    const [leftOrRightValues, rightValuesOrSelector] = args

    if (isReadonlyArray(rightValuesOrSelector)) {
      return isDisjointFromImpl(leftOrRightValues, rightValuesOrSelector)
    }

    if (isRuntimeSelector(rightValuesOrSelector)) {
      return (leftValues: readonly unknown[]) =>
        isDisjointFromByImpl(
          leftValues,
          leftOrRightValues,
          rightValuesOrSelector,
        )
    }
  }

  const [leftValues, rightValues, selector] = args

  if (isRuntimeSelector(selector)) {
    return isDisjointFromByImpl(leftValues, rightValues, selector)
  }

  return invalidArguments()
}

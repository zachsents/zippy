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

function isSubsetOfImpl(
  values: readonly unknown[],
  otherValues: readonly unknown[],
) {
  const otherSet = new Set(otherValues)

  return values.every((value) => otherSet.has(value))
}

function isSubsetOfByImpl(
  values: readonly unknown[],
  otherValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const otherKeys = selectedKeys(otherValues, selector)

  for (const [index, value] of values.entries()) {
    if (!otherKeys.has(selectKey(selector, value, index, values))) {
      return false
    }
  }

  return true
}

// authoritative pipe curry; path
export function isSubsetOf<Value, Compared>(
  otherValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): (values: readonly Value[]) => boolean

// generic curry; path
export function isSubsetOf<
  Path extends string,
  Compared extends PathSatisfier<Path>,
>(
  otherValues: readonly Compared[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends PathSatisfier<Path>>(values: readonly Value[]) => boolean

// authoritative pipe curry; selector fn
export function isSubsetOf<Value, Compared>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<NoInfer<Value | Compared>>,
): (values: readonly Value[]) => boolean

// generic curry; selector fn
export function isSubsetOf<Shape, Compared extends Shape>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends Shape>(values: readonly Value[]) => boolean

// normal; path
export function isSubsetOf<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): boolean

// normal; selector fn
export function isSubsetOf<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared>,
): boolean

// normal values
export function isSubsetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean

// curried values
export function isSubsetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean

export function isSubsetOf(
  ...args:
    | [otherValues: readonly unknown[]]
    | [values: readonly unknown[], otherValues: readonly unknown[]]
    | [otherValues: readonly unknown[], selector: RuntimeSelector]
    | [
        values: readonly unknown[],
        otherValues: readonly unknown[],
        selector: RuntimeSelector,
      ]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return (values: readonly unknown[]) => isSubsetOfImpl(values, otherValues)
  }

  if (args.length === 2) {
    const [valuesOrOtherValues, otherValuesOrSelector] = args

    if (isReadonlyArray(otherValuesOrSelector)) {
      return isSubsetOfImpl(valuesOrOtherValues, otherValuesOrSelector)
    }

    if (isRuntimeSelector(otherValuesOrSelector)) {
      return (values: readonly unknown[]) =>
        isSubsetOfByImpl(values, valuesOrOtherValues, otherValuesOrSelector)
    }
  }

  const [values, otherValues, selector] = args

  if (isRuntimeSelector(selector)) {
    return isSubsetOfByImpl(values, otherValues, selector)
  }

  return invalidArguments()
}

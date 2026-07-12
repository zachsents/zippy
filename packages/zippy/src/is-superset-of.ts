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

function isSupersetOfImpl(
  values: readonly unknown[],
  otherValues: readonly unknown[],
) {
  const valuesSet = new Set(values)

  return otherValues.every((value) => valuesSet.has(value))
}

function isSupersetOfByImpl(
  values: readonly unknown[],
  otherValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const valueKeys = selectedKeys(values, selector)

  for (const [index, value] of otherValues.entries()) {
    if (!valueKeys.has(selectKey(selector, value, index, otherValues))) {
      return false
    }
  }

  return true
}

// authoritative pipe curry; path
export function isSupersetOf<Value, Compared>(
  otherValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): (values: readonly Value[]) => boolean

// generic curry; path
export function isSupersetOf<
  Path extends string,
  Compared extends PathSatisfier<Path>,
>(
  otherValues: readonly Compared[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends PathSatisfier<Path>>(values: readonly Value[]) => boolean

// authoritative pipe curry; selector fn
export function isSupersetOf<Value, Compared>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<NoInfer<Value | Compared>>,
): (values: readonly Value[]) => boolean

// generic curry; selector fn
export function isSupersetOf<Shape, Compared extends Shape>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends Shape>(values: readonly Value[]) => boolean

// normal; path
export function isSupersetOf<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): boolean

// normal; selector fn
export function isSupersetOf<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared>,
): boolean

// normal values
export function isSupersetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean

// curried values
export function isSupersetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean

export function isSupersetOf(
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

    return (values: readonly unknown[]) => isSupersetOfImpl(values, otherValues)
  }

  if (args.length === 2) {
    const [valuesOrOtherValues, otherValuesOrSelector] = args

    if (isReadonlyArray(otherValuesOrSelector)) {
      return isSupersetOfImpl(valuesOrOtherValues, otherValuesOrSelector)
    }

    if (isRuntimeSelector(otherValuesOrSelector)) {
      return (values: readonly unknown[]) =>
        isSupersetOfByImpl(values, valuesOrOtherValues, otherValuesOrSelector)
    }
  }

  const [values, otherValues, selector] = args

  if (isRuntimeSelector(selector)) {
    return isSupersetOfByImpl(values, otherValues, selector)
  }

  return invalidArguments()
}

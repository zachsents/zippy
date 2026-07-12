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

function intersectionImpl(
  values: readonly unknown[],
  otherArrays: Array<readonly unknown[]>,
) {
  const otherSets = otherArrays.map((otherValues) => new Set(otherValues))

  return unique(values).filter((value) =>
    otherSets.every((otherSet) => otherSet.has(value)),
  )
}

function intersectionByImpl(
  values: readonly unknown[],
  comparedValues: readonly unknown[],
  selector: RuntimeSelector,
) {
  const comparedKeys = new Set<unknown>()
  const seenKeys = new Set<unknown>()
  const result: unknown[] = []

  for (const [index, value] of comparedValues.entries()) {
    comparedKeys.add(selectKey(selector, value, index, comparedValues))
  }

  for (const [index, value] of values.entries()) {
    const key = selectKey(selector, value, index, values)

    if (comparedKeys.has(key) && !seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

// authoritative pipe curry; path
export function intersection<Value, Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): (values: readonly Value[]) => Value[]

// generic curry; path
export function intersection<
  Path extends string,
  Compared extends PathSatisfier<Path>,
>(
  comparedValues: readonly Compared[],
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends PathSatisfier<Path>>(values: readonly Value[]) => Value[]

// authoritative pipe curry; selector fn
export function intersection<Value, Compared>(
  comparedValues: readonly Compared[],
  selector: SelectorFunction<NoInfer<Value | Compared>>,
): (values: readonly Value[]) => Value[]

// generic curry; selector fn
export function intersection<Shape, Compared extends Shape>(
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Shape>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<Value extends Shape>(values: readonly Value[]) => Value[]

// normal; path
export function intersection<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorPath<Value | Compared>,
): Value[]

// normal; selector fn
export function intersection<Value, Compared>(
  values: readonly Value[],
  comparedValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared>,
): Value[]

// normal values
export function intersection<T>(
  values: readonly T[],
  otherValues: readonly unknown[],
  ...otherArrays: Array<readonly unknown[]>
): T[]

// curried values
export function intersection(
  otherValues: readonly unknown[],
): <T>(values: readonly T[]) => T[]

export function intersection(
  a: readonly unknown[],
  b?: readonly unknown[] | RuntimeSelector,
  c?: readonly unknown[] | RuntimeSelector,
  ...rest: Array<readonly unknown[]>
) {
  if (b === undefined) {
    return (values: readonly unknown[]) => intersectionImpl(values, [a])
  }

  if (isRuntimeSelector(b)) {
    return (values: readonly unknown[]) => intersectionByImpl(values, a, b)
  }

  if (c === undefined) {
    return intersectionImpl(a, [b])
  }

  return isRuntimeSelector(c)
    ? intersectionByImpl(a, b, c)
    : intersectionImpl(a, [b, c, ...rest])
}

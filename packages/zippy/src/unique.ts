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

function uniqueImpl<T>(values: readonly T[]) {
  return Array.from(new Set(values))
}

function uniqueByImpl(values: readonly unknown[], selector: RuntimeSelector) {
  const seenKeys = new Set<unknown>()
  const result: unknown[] = []

  for (const [index, value] of values.entries()) {
    const key =
      typeof selector === "string"
        ? getPropertyPathValue(value, selector)
        : selector(value, index, values)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }
  }

  return result
}

// authoritative pipe curry; path
export function unique<T>(
  selector: SelectorPath<T>,
): (values: readonly T[]) => T[]

// generic curry; path
export function unique<Path extends string>(
  selector: Path,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<T extends PathSatisfier<Path>>(values: readonly T[]) => T[]

// authoritative pipe curry; selector fn
export function unique<T>(
  selector: SelectorFunction<NoInfer<T>>,
): (values: readonly T[]) => T[]

// generic curry; selector fn
export function unique<T>(
  selector: SelectorFunction<T>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<U extends T>(values: readonly U[]) => U[]

// normal; path
export function unique<T>(values: readonly T[], selector: SelectorPath<T>): T[]

// normal; selector fn
export function unique<T>(
  values: readonly T[],
  selector: SelectorFunction<T>,
): T[]

// normal values
export function unique<T>(values: readonly T[]): T[]

// curried values
export function unique(): <T>(values: readonly T[]) => T[]

export function unique(
  ...args:
    | []
    | [readonly unknown[]]
    | [RuntimeSelector]
    | [values: readonly unknown[], selector: RuntimeSelector]
) {
  if (args.length === 0) {
    return uniqueImpl
  }

  if (args.length === 1) {
    const [a] = args

    if (isReadonlyArray(a)) {
      return uniqueImpl(a)
    }

    if (isRuntimeSelector(a)) {
      return (values: readonly unknown[]) => uniqueByImpl(values, a)
    }
  }

  const [values, selector] = args

  if (isReadonlyArray(values) && isRuntimeSelector(selector)) {
    return uniqueByImpl(values, selector)
  }

  return invalidArguments()
}

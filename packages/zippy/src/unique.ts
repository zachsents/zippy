import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

const impl = <T>(values: readonly T[]) => Array.from(new Set(values))

function uniqueByValues<T>(
  values: readonly T[],
  selector: SelectorFunction<T> | string,
) {
  const seenKeys = new Set<unknown>()
  const result: T[] = []
  let index = 0

  for (const value of values) {
    const key = selectValue(selector, value, index, values)

    if (!seenKeys.has(key)) {
      seenKeys.add(key)
      result.push(value)
    }

    index += 1
  }

  return result
}

export function unique<T>(values: readonly T[]): T[]
export function unique(): <T>(values: readonly T[]) => T[]
export function unique<T>(values?: readonly T[]) {
  if (values === undefined) {
    return impl
  }

  return impl(values)
}

export function uniqueBy<T>(
  values: readonly T[],
  selector: SelectorFunction<T> | PropertyPath<T>,
): T[]
export function uniqueBy<T>(
  selector: SelectorFunction<T> | PropertyPath<T>,
): (values: readonly T[]) => T[]
export function uniqueBy<const Path extends string>(
  selector: Path,
): <T>(values: readonly T[] & ValidPropertyPath<T, Path, unknown>) => T[]
export function uniqueBy<T>(
  ...args:
    | [values: readonly T[], selector: SelectorFunction<T> | string]
    | [selector: SelectorFunction<T> | string]
) {
  if (args.length === 1) {
    const [selector] = args

    return (values: readonly T[]) => uniqueByValues(values, selector)
  }

  const [values, selector] = args

  return uniqueByValues(values, selector)
}

import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

function modeValue<T>(values: readonly T[]) {
  const counts = new Map<T, number>()
  const orderedValues: T[] = []

  for (const value of values) {
    const count = counts.get(value)

    if (count === undefined) {
      counts.set(value, 1)
      orderedValues.push(value)
    } else {
      counts.set(value, count + 1)
    }
  }

  let bestValue: T | undefined
  let bestCount = 0

  for (const value of orderedValues) {
    const count = counts.get(value)

    if (count !== undefined && count > bestCount) {
      bestValue = value
      bestCount = count
    }
  }

  return bestValue
}

function modeMapped<T>(
  values: readonly T[],
  mapper: SelectorFunction<T> | string,
) {
  const counts = new Map<unknown, number>()
  const firstValues = new Map<unknown, T>()
  const orderedKeys: unknown[] = []
  let index = 0

  for (const value of values) {
    const key = selectValue(mapper, value, index, values)
    const count = counts.get(key)

    if (count === undefined) {
      counts.set(key, 1)
      firstValues.set(key, value)
      orderedKeys.push(key)
    } else {
      counts.set(key, count + 1)
    }

    index += 1
  }

  let bestValue: T | undefined
  let bestCount = 0

  for (const key of orderedKeys) {
    const count = counts.get(key)

    if (count !== undefined && count > bestCount) {
      bestValue = firstValues.get(key)
      bestCount = count
    }
  }

  return bestValue
}

export function mode<T>(values: readonly T[]): T | undefined
export function mode(): <T>(values: readonly T[]) => T | undefined
export function mode<T>(values?: readonly T[]) {
  if (values === undefined) {
    return modeValue
  }

  return modeValue(values)
}

export function modeBy<T>(
  values: readonly T[],
  mapper: SelectorFunction<T> | PropertyPath<T>,
): T | undefined
export function modeBy<T>(
  mapper: SelectorFunction<T> | PropertyPath<T>,
): (values: readonly T[]) => T | undefined
export function modeBy<const Path extends string>(
  mapper: Path,
): <T>(
  values: readonly T[] & ValidPropertyPath<T, Path, unknown>,
) => T | undefined
export function modeBy<T>(
  ...args:
    | [values: readonly T[], mapper: SelectorFunction<T> | string]
    | [mapper: SelectorFunction<T> | string]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => modeMapped(values, mapper)
  }

  const [values, mapper] = args

  return modeMapped(values, mapper)
}

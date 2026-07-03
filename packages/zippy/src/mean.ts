import {
  selectNumber,
  type PropertyPathByValue,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

function sumValues(values: readonly number[]) {
  let result = 0

  for (const value of values) {
    result += value
  }

  return result
}

function sumMapped<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | string,
) {
  let result = 0
  let index = 0

  for (const value of values) {
    result += selectNumber(mapper, value, index, values)
    index += 1
  }

  return result
}

export function mean(values: readonly number[]): number | undefined
export function mean(): (values: readonly number[]) => number | undefined
export function mean(values?: readonly number[]) {
  if (values === undefined) {
    return (values: readonly number[]) => mean(values)
  }

  if (values.length === 0) {
    return undefined
  }

  return sumValues(values) / values.length
}

export function meanBy<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): number | undefined
export function meanBy<T>(
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): (values: readonly T[]) => number | undefined
export function meanBy<const Path extends string>(
  mapper: Path,
): <T>(
  values: readonly T[] & ValidPropertyPath<T, Path, number>,
) => number | undefined
export function meanBy<T>(
  ...args:
    | [values: readonly T[], mapper: SelectorFunction<T, number> | string]
    | [mapper: SelectorFunction<T, number> | string]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => {
      if (values.length === 0) {
        return undefined
      }

      return sumMapped(values, mapper) / values.length
    }
  }

  const [values, mapper] = args

  if (values.length === 0) {
    return undefined
  }

  return sumMapped(values, mapper) / values.length
}

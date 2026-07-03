import {
  selectNumber,
  type PropertyPathByValue,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

function medianValues(values: readonly number[]) {
  if (values.length === 0) {
    return undefined
  }

  const sorted = [...values]
  // eslint-disable-next-line unicorn/no-array-sort -- Intentionally sort a copied array for older runtimes.
  sorted.sort((left, right) => left - right)
  const midpoint = Math.floor(sorted.length / 2)
  const right = sorted[midpoint]

  if (right === undefined) {
    return undefined
  }

  if (sorted.length % 2 === 1) {
    return right
  }

  const left = sorted[midpoint - 1]

  if (left === undefined) {
    return undefined
  }

  return (left + right) / 2
}

function medianMapped<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | string,
) {
  const mappedValues: number[] = []
  let index = 0

  for (const value of values) {
    mappedValues.push(selectNumber(mapper, value, index, values))
    index += 1
  }

  return medianValues(mappedValues)
}

export function median(values: readonly number[]): number | undefined
export function median(): (values: readonly number[]) => number | undefined
export function median(values?: readonly number[]) {
  if (values === undefined) {
    return medianValues
  }

  return medianValues(values)
}

export function medianBy<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): number | undefined
export function medianBy<T>(
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): (values: readonly T[]) => number | undefined
export function medianBy<const Path extends string>(
  mapper: Path,
): <T>(
  values: readonly T[] & ValidPropertyPath<T, Path, number>,
) => number | undefined
export function medianBy<T>(
  ...args:
    | [values: readonly T[], mapper: SelectorFunction<T, number> | string]
    | [mapper: SelectorFunction<T, number> | string]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => medianMapped(values, mapper)
  }

  const [values, mapper] = args
  return medianMapped(values, mapper)
}

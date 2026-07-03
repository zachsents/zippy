type NumberMapper<T> = (value: T, index: number, values: readonly T[]) => number

function sumValues(values: readonly number[]) {
  let result = 0

  for (const value of values) {
    result += value
  }

  return result
}

function sumMapped<T>(values: readonly T[], mapper: NumberMapper<T>) {
  let result = 0
  let index = 0

  for (const value of values) {
    result += mapper(value, index, values)
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
  mapper: NumberMapper<T>,
): number | undefined
export function meanBy<T>(
  mapper: NumberMapper<T>,
): (values: readonly T[]) => number | undefined
export function meanBy<T>(
  ...args:
    | [values: readonly T[], mapper: NumberMapper<T>]
    | [mapper: NumberMapper<T>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => meanBy(values, mapper)
  }

  const [values, mapper] = args

  if (values.length === 0) {
    return undefined
  }

  return sumMapped(values, mapper) / values.length
}

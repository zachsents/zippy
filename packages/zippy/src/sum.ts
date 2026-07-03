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

export function sum(values: readonly number[]): number
export function sum(): (values: readonly number[]) => number
export function sum(values?: readonly number[]) {
  if (values === undefined) {
    return sumValues
  }

  return sumValues(values)
}

export function sumBy<T>(values: readonly T[], mapper: NumberMapper<T>): number
export function sumBy<T>(
  mapper: NumberMapper<T>,
): (values: readonly T[]) => number
export function sumBy<T>(
  ...args:
    | [values: readonly T[], mapper: NumberMapper<T>]
    | [mapper: NumberMapper<T>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => sumMapped(values, mapper)
  }

  const [values, mapper] = args

  return sumMapped(values, mapper)
}

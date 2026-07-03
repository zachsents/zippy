type NumberMapper<T> = (value: T, index: number, values: readonly T[]) => number

function medianValues(values: readonly number[]) {
  if (values.length === 0) {
    return undefined
  }

  const sorted = values.toSorted((left, right) => left - right)
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
  mapper: NumberMapper<T>,
): number | undefined
export function medianBy<T>(
  mapper: NumberMapper<T>,
): (values: readonly T[]) => number | undefined
export function medianBy<T>(
  ...args:
    | [values: readonly T[], mapper: NumberMapper<T>]
    | [mapper: NumberMapper<T>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => medianBy(values, mapper)
  }

  const [values, mapper] = args
  const mappedValues: number[] = []
  let index = 0

  for (const value of values) {
    mappedValues.push(mapper(value, index, values))
    index += 1
  }

  return medianValues(mappedValues)
}

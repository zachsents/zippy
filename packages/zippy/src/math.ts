type NumberMapper<T> = (value: T, index: number, values: readonly T[]) => number

type KeyMapper<T, Key> = (value: T, index: number, values: readonly T[]) => Key

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

function modeMapped<T, Key>(values: readonly T[], mapper: KeyMapper<T, Key>) {
  const counts = new Map<Key, number>()
  const firstValues = new Map<Key, T>()
  const orderedKeys: Key[] = []
  let index = 0

  for (const value of values) {
    const key = mapper(value, index, values)
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

export function mode<T>(values: readonly T[]): T | undefined
export function mode(): <T>(values: readonly T[]) => T | undefined
export function mode<T>(values?: readonly T[]) {
  if (values === undefined) {
    return modeValue
  }

  return modeValue(values)
}

export function modeBy<T, Key>(
  values: readonly T[],
  mapper: KeyMapper<T, Key>,
): T | undefined
export function modeBy<T, Key>(
  mapper: KeyMapper<T, Key>,
): (values: readonly T[]) => T | undefined
export function modeBy<T, Key>(
  ...args:
    | [values: readonly T[], mapper: KeyMapper<T, Key>]
    | [mapper: KeyMapper<T, Key>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => modeMapped(values, mapper)
  }

  const [values, mapper] = args

  return modeMapped(values, mapper)
}

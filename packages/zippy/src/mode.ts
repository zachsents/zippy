type KeyMapper<T, Key> = (value: T, index: number, values: readonly T[]) => Key

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

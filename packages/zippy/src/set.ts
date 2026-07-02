import { unique } from "./unique"

function toSet<T>(arrays: Iterable<readonly T[]>): Set<T> {
  const result = new Set<T>()

  for (const values of arrays) {
    for (const value of values) {
      result.add(value)
    }
  }

  return result
}

type ArrayValue<T> = T extends readonly (infer Value)[] ? Value : never

export function union<T, U, Rest extends Array<readonly unknown[]>>(
  values: readonly T[],
  otherValues: readonly U[],
  ...otherArrays: Rest
): Array<T | U | ArrayValue<Rest[number]>>
export function union<U>(
  otherValues: readonly U[],
): <T>(values: readonly T[]) => Array<T | U>
export function union(
  ...arrays:
    | [
        values: readonly unknown[],
        otherValues: readonly unknown[],
        ...otherArrays: Array<readonly unknown[]>,
      ]
    | [otherValues: readonly unknown[]]
) {
  if (arrays.length === 1) {
    const [otherValues] = arrays

    return (values: readonly unknown[]) => union(values, otherValues)
  }

  return Array.from(toSet(arrays))
}

export function difference<T>(
  values: readonly T[],
  excludedValues: readonly unknown[],
  ...excludedArrays: Array<readonly unknown[]>
): T[]
export function difference(
  excludedValues: readonly unknown[],
): <T>(values: readonly T[]) => T[]
export function difference<T>(
  ...args:
    | [
        values: readonly T[],
        excludedValues: readonly unknown[],
        ...excludedArrays: Array<readonly unknown[]>,
      ]
    | [excludedValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [excludedValues] = args

    return <InputValue>(values: readonly InputValue[]) =>
      difference(values, excludedValues)
  }

  const [values, ...excludedArrays] = args
  const excluded = toSet(excludedArrays)

  return unique(values).filter((value) => !excluded.has(value))
}

export function intersection<T>(
  values: readonly T[],
  otherValues: readonly unknown[],
  ...otherArrays: Array<readonly unknown[]>
): T[]
export function intersection(
  otherValues: readonly unknown[],
): <T>(values: readonly T[]) => T[]
export function intersection<T>(
  ...args:
    | [
        values: readonly T[],
        otherValues: readonly unknown[],
        ...otherArrays: Array<readonly unknown[]>,
      ]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return <InputValue>(values: readonly InputValue[]) =>
      intersection(values, otherValues)
  }

  const [values, ...otherArrays] = args
  const otherSets = otherArrays.map((otherValues) => new Set(otherValues))

  return unique(values).filter((value) =>
    otherSets.every((otherSet) => otherSet.has(value)),
  )
}

export function symmetricDifference<T, U>(
  left: readonly T[],
  right: readonly U[],
): Array<T | U>
export function symmetricDifference<U>(
  right: readonly U[],
): <T>(left: readonly T[]) => Array<T | U>
export function symmetricDifference<T, U>(
  ...args: [left: readonly T[], right: readonly U[]] | [right: readonly U[]]
) {
  if (args.length === 1) {
    const [right] = args

    return <InputLeft>(left: readonly InputLeft[]) =>
      symmetricDifference(left, right)
  }

  const [left, right] = args
  const leftSet = new Set<unknown>(left)
  const rightSet = new Set<unknown>(right)

  return [
    ...unique(left).filter((value) => !rightSet.has(value)),
    ...unique(right).filter((value) => !leftSet.has(value)),
  ]
}

export function isSubsetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean
export function isSubsetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean
export function isSubsetOf(
  ...args:
    | [values: readonly unknown[], otherValues: readonly unknown[]]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return (values: readonly unknown[]) => isSubsetOf(values, otherValues)
  }

  const [values, otherValues] = args
  const otherSet = new Set(otherValues)

  return values.every((value) => otherSet.has(value))
}

export function isSupersetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean
export function isSupersetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean
export function isSupersetOf(
  ...args:
    | [values: readonly unknown[], otherValues: readonly unknown[]]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return (values: readonly unknown[]) => isSupersetOf(values, otherValues)
  }

  const [values, otherValues] = args

  return isSubsetOf(otherValues, values)
}

export function isDisjointFrom(
  left: readonly unknown[],
  right: readonly unknown[],
): boolean
export function isDisjointFrom(
  right: readonly unknown[],
): (left: readonly unknown[]) => boolean
export function isDisjointFrom(
  ...args:
    | [left: readonly unknown[], right: readonly unknown[]]
    | [right: readonly unknown[]]
) {
  if (args.length === 1) {
    const [right] = args

    return (left: readonly unknown[]) => isDisjointFrom(left, right)
  }

  const [left, right] = args
  const rightSet = new Set(right)

  return left.every((value) => !rightSet.has(value))
}

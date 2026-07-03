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

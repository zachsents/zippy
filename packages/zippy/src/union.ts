type ArrayValue<T> = T extends readonly (infer Value)[] ? Value : never

function toSet<T>(arrays: Iterable<readonly T[]>): Set<T> {
  const result = new Set<T>()

  for (const values of arrays) {
    for (const value of values) {
      result.add(value)
    }
  }

  return result
}

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

import { unique } from "./unique"

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

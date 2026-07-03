import { unique } from "./unique"

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

import { isReadonlyArray } from "./is-readonly-array"
import { tuple } from "./tuple"

type ZipMerger<Left = unknown, Right = unknown, Merged = unknown> = (
  leftValue: Left,
  rightValue: Right,
  index: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Merged

const zipTuple = (leftValue: unknown, rightValue: unknown) =>
  tuple(leftValue, rightValue)

function impl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  merger: ZipMerger = zipTuple,
) {
  const smaller =
    leftValues.length < rightValues.length ? leftValues : rightValues
  return smaller.map((_, i) =>
    merger(leftValues[i], rightValues[i], i, leftValues, rightValues),
  )
}

export function zip<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  merger: ZipMerger<Left, Right, Merged>,
): Merged[]
export function zip<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
): Array<[Left, Right]>
export function zip<Left, Right, Merged>(
  rightValues: readonly Right[],
  merger: ZipMerger<Left, Right, Merged>,
): (leftValues: readonly Left[]) => Merged[]
export function zip<Right>(
  rightValues: readonly Right[],
): <Left>(leftValues: readonly Left[]) => Array<[Left, Right]>
export function zip(
  ...args:
    | [a: readonly unknown[]]
    | [a: readonly unknown[], b: readonly unknown[] | ZipMerger]
    | [a: readonly unknown[], b: readonly unknown[], c: ZipMerger]
) {
  if (args.length === 1) {
    return (leftValues: []) => impl(leftValues, args[0])
  }

  if (args.length === 2) {
    const [a, b] = args
    return isReadonlyArray(b)
      ? impl(a, b)
      : (leftValues: []) => impl(leftValues, a, b)
  }

  return impl(...args)
}

import { tuple } from "./tuple"

type ZipMerger<Left, Right, Merged> = (
  leftValue: Left,
  rightValue: Right,
  index: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Merged

type ZipDataFirstArgs<Left, Right, Merged> = [
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  merger?: ZipMerger<Left, Right, Merged>,
]

type ZipDataLastArgs<Left, Right, Merged> = [
  rightValues: readonly Right[],
  merger?: ZipMerger<Left, Right, Merged>,
]

type ZipArgs<Left, Right, Merged> =
  | ZipDataFirstArgs<Left, Right, Merged>
  | ZipDataLastArgs<Left, Right, Merged>

function zipValues<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  merger?: ZipMerger<Left, Right, Merged>,
) {
  const result: Array<Merged | [Left, Right]> = []
  const rightIterator = rightValues[Symbol.iterator]()
  let index = 0

  for (const leftValue of leftValues) {
    const rightResult = rightIterator.next()

    if (rightResult.done === true) {
      break
    }

    result.push(
      merger === undefined
        ? tuple(leftValue, rightResult.value)
        : merger(leftValue, rightResult.value, index, leftValues, rightValues),
    )
    index += 1
  }

  return result
}

function hasZipRightValues<Left, Right, Merged>(
  args: ZipArgs<Left, Right, Merged>,
): args is ZipDataFirstArgs<Left, Right, Merged> {
  return Array.isArray(args[1])
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
export function zip<Left, Right, Merged>(
  ...args: ZipArgs<Left, Right, Merged>
) {
  if (args.length === 1) {
    const [rightValues] = args

    return (leftValues: readonly unknown[]) =>
      zipValues(leftValues, rightValues)
  }

  if (hasZipRightValues(args)) {
    const [leftValues, rightValues, merger] = args

    return zipValues(leftValues, rightValues, merger)
  }

  const [rightValues, merger] = args

  return (leftValues: readonly Left[]) =>
    zipValues(leftValues, rightValues, merger)
}

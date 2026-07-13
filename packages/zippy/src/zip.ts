import { isReadonlyArray } from "./guards"
import { tuple } from "./tuple"

type ZipMerger<Left = unknown, Right = unknown, Mapped = unknown> = (
  leftValue: Left,
  rightValue: Right,
  index: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Mapped

function zipImpl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  merger: ZipMerger = (leftValue, rightValue) => tuple(leftValue, rightValue),
) {
  const result: unknown[] = []
  const length = Math.min(leftValues.length, rightValues.length)

  for (let index = 0; index < length; index += 1) {
    result.push(
      merger(
        leftValues[index],
        rightValues[index],
        index,
        leftValues,
        rightValues,
      ),
    )
  }

  return result
}

// authoritative pipe curry; merger
/**
 * Returns a function that zips the passed left values with the right values and
 * maps each pair with the merger function.
 *
 * @example
 *   const left = ["a", "b"]
 *   zip([1, 2], (l, r) => `${l}:${r}`)(left) // ["a:1", "b:2"]
 */
export function zip<Left, Right, Mapped>(
  rightValues: readonly Right[],
  merger: ZipMerger<NoInfer<Left>, Right, Mapped> &
    (unknown extends Left ? never : unknown),
): (leftValues: readonly Left[]) => Mapped[]

// generic curry; merger
/**
 * Returns a function that zips the passed left values with the right values and
 * maps each pair with the merger function.
 *
 * @example
 *   const left = ["a", "b"]
 *   zip([1, 2], (l: string, r) => `${l}:${r}`)(left) // ["a:1", "b:2"]
 */
export function zip<Left, Right, Mapped>(
  rightValues: readonly Right[],
  merger: ZipMerger<Left, Right, Mapped>,
): // oxlint-disable eslint/no-unnecessary-type-parameters
<InputLeft extends Left>(leftValues: readonly InputLeft[]) => Mapped[]

// curried pairs
/**
 * Returns a function that zips the passed left values with the right values.
 *
 * @example
 *   const left = ["a", "b"]
 *   zip([1, 2])(left) // [["a", 1], ["b", 2]]
 */
export function zip<Right>(
  rightValues: readonly Right[],
): <Left>(leftValues: readonly Left[]) => Array<[Left, Right]>

// normal; merger
/**
 * Zips the passed arrays and maps each pair with the merger function.
 *
 * @example
 *   zip(["a", "b"], [1, 2], (l, r) => `${l}:${r}`) // ["a:1", "b:2"]
 */
export function zip<Left, Right, Mapped>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  merger: ZipMerger<Left, Right, Mapped>,
): Mapped[]

// normal pairs
/**
 * Zips the passed arrays.
 *
 * @example
 *   zip(["a", "b"], [1, 2]) // [["a", 1], ["b", 2]]
 */
export function zip<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
): Array<[Left, Right]>

export function zip(
  ...args:
    | [rightValues: readonly unknown[]]
    | [rightValues: readonly unknown[], merger: ZipMerger]
    | [leftValues: readonly unknown[], rightValues: readonly unknown[]]
    | [
        leftValues: readonly unknown[],
        rightValues: readonly unknown[],
        merger: ZipMerger,
      ]
) {
  if (args.length === 1) {
    const [rightValues] = args

    return (leftValues: readonly unknown[]) => zipImpl(leftValues, rightValues)
  }

  if (args.length === 2) {
    const [leftOrRightValues, rightValuesOrMerger] = args

    return isReadonlyArray(rightValuesOrMerger)
      ? zipImpl(leftOrRightValues, rightValuesOrMerger)
      : (leftValues: readonly unknown[]) =>
          zipImpl(leftValues, leftOrRightValues, rightValuesOrMerger)
  }

  return zipImpl(...args)
}

import type { Merge } from "type-fest"
import { merge } from "./merge"
import {
  getPropertyPathValue,
  type MatchingPath,
  type MatchingPathValue,
  type PathSatisfier,
  type SelectorPath,
} from "./selector"
import { tuple } from "./tuple"

type Cb<Left, Right, Out = unknown> = (
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Out

function isSameValueZero(left: unknown, right: unknown) {
  return left === right || (left !== left && right !== right)
}

function impl(
  leftValues: readonly unknown[],
  rightValues: readonly unknown[],
  matcher: Cb<unknown, unknown> | string,
  merger: (left: unknown, right: unknown) => unknown,
) {
  const matchedRightIndexes = new Set<number>()

  return leftValues.flatMap((leftValue, leftIndex) => {
    for (const [rightIndex, rightValue] of rightValues.entries()) {
      if (matchedRightIndexes.has(rightIndex)) {
        continue
      }

      if (
        !(typeof matcher === "string"
          ? isSameValueZero(
              getPropertyPathValue(leftValue, matcher),
              getPropertyPathValue(rightValue, matcher),
            )
          : matcher(
              leftValue,
              rightValue,
              leftIndex,
              rightIndex,
              leftValues,
              rightValues,
            ))
      ) {
        continue
      }

      matchedRightIndexes.add(rightIndex)

      return [merger(leftValue, rightValue)]
    }

    return []
  })
}

// authoritative pipe curry; path
export function match<Left, Right>(
  rightValues: readonly Right[],
  matcher: MatchingPath<NoInfer<Left>, Right>,
): (leftValues: readonly Left[]) => Array<[Left, Right]>

// generic curry; path
export function match<Right, Path extends SelectorPath<Right>>(
  rightValues: readonly Right[],
  matcher: Path,
): <T extends PathSatisfier<Path, MatchingPathValue<Right, Path>>>(
  leftValues: readonly T[],
) => Array<[T, Right]>

// authoritative pipe curry; selector fn
export function match<Left, Right>(
  rightValues: readonly Right[],
  matcher: Cb<NoInfer<Left>, Right>,
): (leftValues: readonly Left[]) => Array<[Left, Right]>

// generic curry; selector fn
export function match<Right, TMatcher extends Cb<never, Right>>(
  rightValues: readonly Right[],
  matcher: TMatcher,
): <T extends TMatcher extends Cb<infer L, never> ? L : never>(
  leftValues: readonly T[],
) => Array<[T, Right]>

// normal
export function match<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: Cb<Left, Right> | MatchingPath<Left, Right>,
): Array<[Left, Right]>

export function match(
  ...args:
    | [readonly unknown[], Cb<unknown, unknown> | string]
    | [readonly unknown[], readonly unknown[], Cb<unknown, unknown> | string]
) {
  if (args.length === 2) {
    return (leftValues: []) => impl(leftValues, args[0], args[1], tuple)
  }

  return impl(...args, tuple)
}

// authoritative pipe curry; path
export function matchMerge<Left extends object, Right extends object>(
  rightValues: readonly Right[],
  matcher: MatchingPath<NoInfer<Left>, Right>,
): (leftValues: readonly Left[]) => Merge<Left, Right>[]

// generic curry; path
export function matchMerge<
  Right extends object,
  Path extends SelectorPath<Right>,
>(
  rightValues: readonly Right[],
  matcher: Path,
): <T extends PathSatisfier<Path, MatchingPathValue<Right, Path>>>(
  leftValues: readonly T[],
) => Merge<T, Right>[]

// authoritative pipe curry; selector fn
export function matchMerge<Left extends object, Right extends object>(
  rightValues: readonly Right[],
  matcher: Cb<NoInfer<Left>, Right>,
): (leftValues: readonly Left[]) => Merge<Left, Right>[]

// generic curry; selector fn
export function matchMerge<
  Right extends object,
  TMatcher extends Cb<never, Right>,
>(
  rightValues: readonly Right[],
  matcher: TMatcher,
): <T extends TMatcher extends Cb<infer L, never> ? L : never>(
  leftValues: readonly T[],
) => Merge<T, Right>[]

// normal
export function matchMerge<Left extends object, Right extends object>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: Cb<Left, Right> | MatchingPath<Left, Right>,
): Merge<Left, Right>[]

export function matchMerge(
  ...args:
    | [readonly unknown[], Cb<unknown, unknown> | string]
    | [readonly unknown[], readonly unknown[], Cb<unknown, unknown> | string]
) {
  if (args.length === 2) {
    return (leftValues: []) => impl(leftValues, args[0], args[1], merge)
  }

  return impl(...args, merge)
}

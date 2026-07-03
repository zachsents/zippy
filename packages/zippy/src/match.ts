import type { Merge } from "type-fest"

import { merge } from "./merge"
import {
  getPropertyPathValue,
  type PropertyPath,
  type ValidPropertyPath,
} from "./selector"

type MatchMatcher<Left, Right> = (
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => unknown

type MatchMatcherInput<Left, Right> =
  | MatchMatcher<Left, Right>
  | Extract<PropertyPath<Left>, PropertyPath<Right>>

type MatchRuntimeMatcher<Left, Right> = MatchMatcher<Left, Right> | string

type MatchMerger<Left, Right, Merged> = (
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Merged

type MatchDataFirstArgs<Left, Right, Merged> = [
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
  merger?: MatchMerger<Left, Right, Merged>,
]

type MatchDataLastArgs<Left, Right, Merged> = [
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
  merger?: MatchMerger<Left, Right, Merged>,
]

type MatchArgs<Left, Right, Merged> =
  | MatchDataFirstArgs<Left, Right, Merged>
  | MatchDataLastArgs<Left, Right, Merged>

type MatchMergeDataFirstArgs<Left extends object, Right extends object> = [
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
]

type MatchMergeDataLastArgs<Left extends object, Right extends object> = [
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
]

type MatchMergeArgs<Left extends object, Right extends object> =
  | MatchMergeDataFirstArgs<Left, Right>
  | MatchMergeDataLastArgs<Left, Right>

function isSameValueZero(left: unknown, right: unknown) {
  return left === right || (left !== left && right !== right)
}

function matchesValue<Left, Right>(
  matcher: MatchRuntimeMatcher<Left, Right>,
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) {
  if (typeof matcher === "function") {
    return matcher(
      leftValue,
      rightValue,
      leftIndex,
      rightIndex,
      leftValues,
      rightValues,
    )
  }

  return isSameValueZero(
    getPropertyPathValue(leftValue, matcher),
    getPropertyPathValue(rightValue, matcher),
  )
}

function defaultMatchMerger<Left, Right>(
  leftValue: Left,
  rightValue: Right,
): [Left, Right] {
  return [leftValue, rightValue]
}

function matchValues<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
  merger?: MatchMerger<Left, Right, Merged>,
) {
  const mergeValues: MatchMerger<Left, Right, Merged | [Left, Right]> =
    merger ?? defaultMatchMerger
  const result: Array<Merged | [Left, Right]> = []
  const matchedRightIndexes = new Set<number>()

  for (const [leftIndex, leftValue] of leftValues.entries()) {
    for (const [rightIndex, rightValue] of rightValues.entries()) {
      if (matchedRightIndexes.has(rightIndex)) {
        continue
      }

      if (
        !matchesValue(
          matcher,
          leftValue,
          rightValue,
          leftIndex,
          rightIndex,
          leftValues,
          rightValues,
        )
      ) {
        continue
      }

      result.push(
        mergeValues(
          leftValue,
          rightValue,
          leftIndex,
          rightIndex,
          leftValues,
          rightValues,
        ),
      )
      matchedRightIndexes.add(rightIndex)
      break
    }
  }

  return result
}

function matchMergedValues<Left extends object, Right extends object>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchRuntimeMatcher<Left, Right>,
) {
  return matchValues(
    leftValues,
    rightValues,
    matcher,
    (leftValue, rightValue) => merge(leftValue, rightValue),
  )
}

function hasMatchRightValues<Left, Right, Merged>(
  args: MatchArgs<Left, Right, Merged>,
): args is MatchDataFirstArgs<Left, Right, Merged> {
  return Array.isArray(args[1])
}

function hasMatchMergeRightValues<Left extends object, Right extends object>(
  args: MatchMergeArgs<Left, Right>,
): args is MatchMergeDataFirstArgs<Left, Right> {
  return Array.isArray(args[1])
}

export function match<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchMatcherInput<Left, Right>,
  merger: MatchMerger<Left, Right, Merged>,
): Merged[]
export function match<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchMatcherInput<Left, Right>,
): Array<[Left, Right]>
export function match<Left, Right, const Path extends string, Merged>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  matcher: Path,
  merger: MatchMerger<Left, Right, Merged>,
): (
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Merged[]
export function match<Left, Right, Merged>(
  rightValues: readonly Right[],
  matcher: MatchMatcher<Left, Right>,
  merger: MatchMerger<Left, Right, Merged>,
): (leftValues: readonly Left[]) => Merged[]
export function match<Right, const Path extends string>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  matcher: Path,
): <Left>(
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Array<[Left, Right]>
export function match<Left, Right>(
  rightValues: readonly Right[],
  matcher: MatchMatcher<Left, Right>,
): (leftValues: readonly Left[]) => Array<[Left, Right]>
export function match<Left, Right, Merged>(
  ...args: MatchArgs<Left, Right, Merged>
) {
  if (hasMatchRightValues(args)) {
    const [leftValues, rightValues, matcher, merger] = args

    return matchValues(leftValues, rightValues, matcher, merger)
  }

  const [rightValues, matcher, merger] = args

  return (leftValues: readonly Left[]) =>
    matchValues(leftValues, rightValues, matcher, merger)
}

export function matchMerge<Left extends object, Right extends object>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  matcher: MatchMatcherInput<Left, Right>,
): Array<Merge<Left, Right>>
export function matchMerge<Right extends object, const Path extends string>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  matcher: Path,
): <Left extends object>(
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Array<Merge<Left, Right>>
export function matchMerge<Left extends object, Right extends object>(
  rightValues: readonly Right[],
  matcher: MatchMatcher<Left, Right>,
): (leftValues: readonly Left[]) => Array<Merge<Left, Right>>
export function matchMerge<Left extends object, Right extends object>(
  ...args: MatchMergeArgs<Left, Right>
) {
  if (hasMatchMergeRightValues(args)) {
    const [leftValues, rightValues, matcher] = args

    return matchMergedValues(leftValues, rightValues, matcher)
  }

  const [rightValues, matcher] = args

  return (leftValues: readonly Left[]) =>
    matchMergedValues(leftValues, rightValues, matcher)
}

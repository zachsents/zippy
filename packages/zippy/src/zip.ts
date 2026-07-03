import {
  getPropertyPathValue,
  type PropertyPath,
  type ValidPropertyPath,
} from "./selector"

type Zipper<Left, Right, Mapped> = (
  leftValue: Left,
  rightValue: Right,
  index: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Mapped

type ZipCustomMatcher<Left, Right> = (
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => unknown

type ZipCustomMatcherInput<Left, Right> =
  | ZipCustomMatcher<Left, Right>
  | Extract<PropertyPath<Left>, PropertyPath<Right>>

type ZipCustomRuntimeMatcher<Left, Right> =
  | ZipCustomMatcher<Left, Right>
  | string

type ZipCustomMerger<Left, Right, Merged> = (
  leftValue: Left,
  rightValue: Right,
  leftIndex: number,
  rightIndex: number,
  leftValues: readonly Left[],
  rightValues: readonly Right[],
) => Merged

type ZipCustomOptions<Left, Right> = {
  matcher?: ZipCustomMatcherInput<Left, Right>
  merger?: undefined
}

type ZipCustomOptionsWithMerger<Left, Right, Merged> = {
  matcher?: ZipCustomMatcherInput<Left, Right>
  merger: ZipCustomMerger<Left, Right, Merged>
}

type ZipCustomOptionsWithPathMatcher<Path extends string> = {
  matcher: Path
  merger?: undefined
}

type ZipCustomOptionsWithPathMatcherAndMerger<
  Left,
  Right,
  Path extends string,
  Merged,
> = {
  matcher: Path
  merger: ZipCustomMerger<Left, Right, Merged>
}

type ZipCustomRuntimeOptions<Left, Right, Merged> =
  | {
      matcher?: ZipCustomRuntimeMatcher<Left, Right>
      merger?: undefined
    }
  | {
      matcher?: ZipCustomRuntimeMatcher<Left, Right>
      merger: ZipCustomMerger<Left, Right, Merged>
    }

type ZipCustomDataFirstArgs<Left, Right, Merged> = [
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  options?: ZipCustomRuntimeOptions<Left, Right, Merged>,
]

type ZipCustomDataLastArgs<Left, Right, Merged> = [
  rightValues: readonly Right[],
  options?: ZipCustomRuntimeOptions<Left, Right, Merged>,
]

type ZipCustomArgs<Left, Right, Merged> =
  | ZipCustomDataFirstArgs<Left, Right, Merged>
  | ZipCustomDataLastArgs<Left, Right, Merged>

function defaultZipCustomMatcher(
  _leftValue: unknown,
  _rightValue: unknown,
  leftIndex: number,
  rightIndex: number,
) {
  return leftIndex === rightIndex
}

function isSameValueZero(left: unknown, right: unknown) {
  return left === right || (left !== left && right !== right)
}

function matchesZipCustomValue<Left, Right>(
  matcher: ZipCustomRuntimeMatcher<Left, Right>,
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

function defaultZipCustomMerger<Left, Right>(
  leftValue: Left,
  rightValue: Right,
): [Left, Right] {
  return [leftValue, rightValue]
}

function zipCustomValues<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  options?: ZipCustomRuntimeOptions<Left, Right, Merged>,
) {
  const matcher: ZipCustomRuntimeMatcher<Left, Right> =
    options?.matcher ?? defaultZipCustomMatcher
  const merger: ZipCustomMerger<Left, Right, Merged | [Left, Right]> =
    options?.merger ?? defaultZipCustomMerger
  const result: Array<Merged | [Left, Right]> = []
  const matchedRightIndexes = new Set<number>()

  for (const [leftIndex, leftValue] of leftValues.entries()) {
    for (const [rightIndex, rightValue] of rightValues.entries()) {
      if (matchedRightIndexes.has(rightIndex)) {
        continue
      }

      if (
        !matchesZipCustomValue(
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
        merger(
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

function hasZipCustomRightValues<Left, Right, Merged>(
  args: ZipCustomArgs<Left, Right, Merged>,
): args is ZipCustomDataFirstArgs<Left, Right, Merged> {
  return Array.isArray(args[1])
}

export function zip<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
): Array<[Left, Right]>
export function zip<Right>(
  rightValues: readonly Right[],
): <Left>(leftValues: readonly Left[]) => Array<[Left, Right]>
export function zip<Left, Right>(
  ...args:
    | [leftValues: readonly Left[], rightValues: readonly Right[]]
    | [rightValues: readonly Right[]]
) {
  if (args.length === 1) {
    const [rightValues] = args

    return <InputLeft>(leftValues: readonly InputLeft[]) =>
      zip(leftValues, rightValues)
  }

  const [leftValues, rightValues] = args

  return zipWith(leftValues, rightValues, (leftValue, rightValue) => [
    leftValue,
    rightValue,
  ])
}

export function zipWith<Left, Right, Mapped>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  zipper: Zipper<Left, Right, Mapped>,
): Mapped[]
export function zipWith<Left, Right, Mapped>(
  rightValues: readonly Right[],
  zipper: Zipper<Left, Right, Mapped>,
): (leftValues: readonly Left[]) => Mapped[]
export function zipWith<Left, Right, Mapped>(
  ...args:
    | [
        leftValues: readonly Left[],
        rightValues: readonly Right[],
        zipper: Zipper<Left, Right, Mapped>,
      ]
    | [rightValues: readonly Right[], zipper: Zipper<Left, Right, Mapped>]
) {
  if (args.length === 2) {
    const [rightValues, zipper] = args

    return (leftValues: readonly Left[]) =>
      zipWith(leftValues, rightValues, zipper)
  }

  const [leftValues, rightValues, zipper] = args
  const result: Mapped[] = []
  const rightIterator = rightValues[Symbol.iterator]()
  let index = 0

  for (const leftValue of leftValues) {
    const rightResult = rightIterator.next()

    if (rightResult.done === true) {
      break
    }

    result.push(
      zipper(leftValue, rightResult.value, index, leftValues, rightValues),
    )
    index += 1
  }

  return result
}

export function zipCustom<Left, Right, Merged>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  options: ZipCustomOptionsWithMerger<Left, Right, Merged>,
): Merged[]
export function zipCustom<Left, Right>(
  leftValues: readonly Left[],
  rightValues: readonly Right[],
  options?: ZipCustomOptions<Left, Right>,
): Array<[Left, Right]>
export function zipCustom<Left, Right, const Path extends string, Merged>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  options: ZipCustomOptionsWithPathMatcherAndMerger<Left, Right, Path, Merged>,
): (
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Merged[]
export function zipCustom<Left, Right, Merged>(
  rightValues: readonly Right[],
  options: ZipCustomOptionsWithMerger<Left, Right, Merged>,
): (leftValues: readonly Left[]) => Merged[]
export function zipCustom<Right, const Path extends string>(
  rightValues: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  options: ZipCustomOptionsWithPathMatcher<Path>,
): <Left>(
  leftValues: readonly Left[] & ValidPropertyPath<Left, Path, unknown>,
) => Array<[Left, Right]>
export function zipCustom<Left, Right>(
  rightValues: readonly Right[],
  options: ZipCustomOptions<Left, Right>,
): (leftValues: readonly Left[]) => Array<[Left, Right]>
export function zipCustom<Right>(
  rightValues: readonly Right[],
): <Left>(leftValues: readonly Left[]) => Array<[Left, Right]>
export function zipCustom<Left, Right, Merged>(
  ...args: ZipCustomArgs<Left, Right, Merged>
) {
  if (args.length === 1) {
    const [rightValues] = args

    return (leftValues: readonly Left[]) =>
      zipCustomValues(leftValues, rightValues)
  }

  if (hasZipCustomRightValues(args)) {
    const [leftValues, rightValues, options] = args

    return zipCustomValues(leftValues, rightValues, options)
  }

  const [rightValues, options] = args

  return (leftValues: readonly Left[]) =>
    zipCustomValues(leftValues, rightValues, options)
}

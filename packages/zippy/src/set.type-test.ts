// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { difference } from "./difference"
import { intersection } from "./intersection"
import { isDisjointFrom, isSubsetOf, isSupersetOf } from "./set-predicates"
import { symmetricDifference } from "./symmetric-difference"
import { union } from "./union"

const unionDataFirst = union([1, 2] as const, ["zippy"] as const)
const unionDataFirstRest = union(
  [1, 2] as const,
  ["zippy"] as const,
  [true] as const,
)
const unionDataLast = union(["zippy"] as const)([1, 2] as const)

true satisfies IsEqual<typeof unionDataFirst, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof unionDataFirstRest, Array<1 | 2 | "zippy" | true>>
true satisfies IsEqual<typeof unionDataLast, Array<1 | 2 | "zippy">>

const differenceDataFirst = difference([1, 2, 3] as const, [2] as const)
const differenceDataLast = difference([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof differenceDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof differenceDataLast, Array<1 | 2 | 3>>

const intersectionDataFirst = intersection([1, 2, 3] as const, [2] as const)
const intersectionDataLast = intersection([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof intersectionDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof intersectionDataLast, Array<1 | 2 | 3>>

const symmetricDifferenceDataFirst = symmetricDifference(
  [1, 2] as const,
  ["zippy"] as const,
)
const symmetricDifferenceDataLast = symmetricDifference(["zippy"] as const)([
  1, 2,
] as const)

true satisfies IsEqual<
  typeof symmetricDifferenceDataFirst,
  Array<1 | 2 | "zippy">
>
true satisfies IsEqual<
  typeof symmetricDifferenceDataLast,
  Array<1 | 2 | "zippy">
>

const isSubsetOfDataFirst = isSubsetOf([1, 2] as const, [1, 2, 3] as const)
const isSubsetOfDataLast = isSubsetOf([1, 2, 3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isSubsetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSubsetOfDataLast, boolean>

const isSupersetOfDataFirst = isSupersetOf([1, 2, 3] as const, [1, 2] as const)
const isSupersetOfDataLast = isSupersetOf([1, 2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof isSupersetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSupersetOfDataLast, boolean>

const isDisjointFromDataFirst = isDisjointFrom([1, 2] as const, [3] as const)
const isDisjointFromDataLast = isDisjointFrom([3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isDisjointFromDataFirst, boolean>
true satisfies IsEqual<typeof isDisjointFromDataLast, boolean>

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { difference, differenceBy } from "./difference"
import { intersection, intersectionBy } from "./intersection"
import {
  isDisjointFrom,
  isDisjointFromBy,
  isSubsetOf,
  isSubsetOfBy,
  isSupersetOf,
  isSupersetOfBy,
} from "./set-predicates"
import {
  symmetricDifference,
  symmetricDifferenceBy,
} from "./symmetric-difference"
import { union, unionBy } from "./union"

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

const leftRecords = [
  { id: 1, group: "left" },
  { id: 2, group: "left" },
]
const rightRecords = [
  { id: 2, group: "right" },
  { id: 3, group: "right" },
]
const nestedLeftRecords = [
  { user: { id: 1 }, name: "one" },
  { user: { id: 2 }, name: "two" },
]
const nestedRightRecords = [{ user: { id: 2 }, name: "right" }]
type RecordValue = { id: number; group: string }
type RecordUnionValue =
  | (typeof leftRecords)[number]
  | (typeof rightRecords)[number]
type NestedRecordValue = { user: { id: number }; name: string }
type NestedRecordUnionValue =
  | (typeof nestedLeftRecords)[number]
  | (typeof nestedRightRecords)[number]

const unionByDataFirst = unionBy(leftRecords, rightRecords, (value) => value.id)
const unionByPathDataFirst = unionBy(leftRecords, rightRecords, "id")
const unionByPathDataLast = unionBy(rightRecords, "id")(leftRecords)
const unionByDotPathDataLast = unionBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof unionByDataFirst, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByPathDataFirst, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByPathDataLast, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByDotPathDataLast, NestedRecordUnionValue[]>

const differenceDataFirst = difference([1, 2, 3] as const, [2] as const)
const differenceDataLast = difference([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof differenceDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof differenceDataLast, Array<1 | 2 | 3>>

const differenceByDataFirst = differenceBy(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const differenceByPathDataFirst = differenceBy(leftRecords, rightRecords, "id")
const differenceByPathDataLast = differenceBy(rightRecords, "id")(leftRecords)
const differenceByDotPathDataLast = differenceBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof differenceByDataFirst, RecordValue[]>
true satisfies IsEqual<typeof differenceByPathDataFirst, RecordValue[]>
true satisfies IsEqual<typeof differenceByPathDataLast, RecordValue[]>
true satisfies IsEqual<typeof differenceByDotPathDataLast, NestedRecordValue[]>

const intersectionDataFirst = intersection([1, 2, 3] as const, [2] as const)
const intersectionDataLast = intersection([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof intersectionDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof intersectionDataLast, Array<1 | 2 | 3>>

const intersectionByDataFirst = intersectionBy(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const intersectionByPathDataFirst = intersectionBy(
  leftRecords,
  rightRecords,
  "id",
)
const intersectionByPathDataLast = intersectionBy(
  rightRecords,
  "id",
)(leftRecords)
const intersectionByDotPathDataLast = intersectionBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof intersectionByDataFirst, RecordValue[]>
true satisfies IsEqual<typeof intersectionByPathDataFirst, RecordValue[]>
true satisfies IsEqual<typeof intersectionByPathDataLast, RecordValue[]>
true satisfies IsEqual<
  typeof intersectionByDotPathDataLast,
  NestedRecordValue[]
>

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

const symmetricDifferenceByDataFirst = symmetricDifferenceBy(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const symmetricDifferenceByPathDataFirst = symmetricDifferenceBy(
  leftRecords,
  rightRecords,
  "id",
)
const symmetricDifferenceByPathDataLast = symmetricDifferenceBy(
  rightRecords,
  "id",
)(leftRecords)
const symmetricDifferenceByDotPathDataLast = symmetricDifferenceBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<
  typeof symmetricDifferenceByDataFirst,
  RecordUnionValue[]
>
true satisfies IsEqual<
  typeof symmetricDifferenceByPathDataFirst,
  RecordUnionValue[]
>
true satisfies IsEqual<
  typeof symmetricDifferenceByPathDataLast,
  RecordUnionValue[]
>
true satisfies IsEqual<
  typeof symmetricDifferenceByDotPathDataLast,
  NestedRecordUnionValue[]
>

const isSubsetOfDataFirst = isSubsetOf([1, 2] as const, [1, 2, 3] as const)
const isSubsetOfDataLast = isSubsetOf([1, 2, 3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isSubsetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSubsetOfDataLast, boolean>

const isSubsetOfByDataFirst = isSubsetOfBy(leftRecords, rightRecords, "id")
const isSubsetOfByDataLast = isSubsetOfBy(rightRecords, "id")(leftRecords)
const isSubsetOfByDotPathDataLast = isSubsetOfBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isSubsetOfByDataFirst, boolean>
true satisfies IsEqual<typeof isSubsetOfByDataLast, boolean>
true satisfies IsEqual<typeof isSubsetOfByDotPathDataLast, boolean>

const isSupersetOfDataFirst = isSupersetOf([1, 2, 3] as const, [1, 2] as const)
const isSupersetOfDataLast = isSupersetOf([1, 2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof isSupersetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSupersetOfDataLast, boolean>

const isSupersetOfByDataFirst = isSupersetOfBy(leftRecords, rightRecords, "id")
const isSupersetOfByDataLast = isSupersetOfBy(rightRecords, "id")(leftRecords)
const isSupersetOfByDotPathDataLast = isSupersetOfBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isSupersetOfByDataFirst, boolean>
true satisfies IsEqual<typeof isSupersetOfByDataLast, boolean>
true satisfies IsEqual<typeof isSupersetOfByDotPathDataLast, boolean>

const isDisjointFromDataFirst = isDisjointFrom([1, 2] as const, [3] as const)
const isDisjointFromDataLast = isDisjointFrom([3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isDisjointFromDataFirst, boolean>
true satisfies IsEqual<typeof isDisjointFromDataLast, boolean>

const isDisjointFromByDataFirst = isDisjointFromBy(
  leftRecords,
  rightRecords,
  "id",
)
const isDisjointFromByDataLast = isDisjointFromBy(
  rightRecords,
  "id",
)(leftRecords)
const isDisjointFromByDotPathDataLast = isDisjointFromBy(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isDisjointFromByDataFirst, boolean>
true satisfies IsEqual<typeof isDisjointFromByDataLast, boolean>
true satisfies IsEqual<typeof isDisjointFromByDotPathDataLast, boolean>

// @ts-expect-error string selectors must exist on the value type.
unionBy(leftRecords, rightRecords, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
differenceBy(rightRecords, "missing")(leftRecords)

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { symmetricDifference } from "./symmetric-difference"

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
const symmetricDifferenceByPathDataLastWithInlineExtraProperties =
  symmetricDifference(
    [{ id: 2, rightOnly: "right" }],
    "id",
  )([{ id: 1, leftOnly: "left" }])
const symmetricDifferenceByFunctionDataLastWithInlineExtraProperties =
  symmetricDifference(
    [{ id: 2, rightOnly: "right" }],
    (value: { id: number }) => value.id,
  )([{ id: 1, leftOnly: "left" }])
type RecordUnionValue =
  | (typeof leftRecords)[number]
  | (typeof rightRecords)[number]
type NestedRecordUnionValue =
  | (typeof nestedLeftRecords)[number]
  | (typeof nestedRightRecords)[number]
type InlineExtraUnionValue =
  | { id: number; leftOnly: string }
  | { id: number; rightOnly: string }

const symmetricDifferenceByDataFirst = symmetricDifference(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const symmetricDifferenceByPathDataFirst = symmetricDifference(
  leftRecords,
  rightRecords,
  "id",
)
const symmetricDifferenceByPathDataLast = symmetricDifference(
  rightRecords,
  "id",
)(leftRecords)
const symmetricDifferenceByDotPathDataLast = symmetricDifference(
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
true satisfies IsEqual<
  typeof symmetricDifferenceByPathDataLastWithInlineExtraProperties,
  InlineExtraUnionValue[]
>
true satisfies IsEqual<
  typeof symmetricDifferenceByFunctionDataLastWithInlineExtraProperties,
  InlineExtraUnionValue[]
>

// @ts-expect-error data-last string selectors are checked once values are provided.
symmetricDifference(rightRecords, "missing")(leftRecords)

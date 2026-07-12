// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { difference } from "./difference"

const differenceDataFirst = difference([1, 2, 3] as const, [2] as const)
const differenceDataFirstRest = difference(
  [1, 2, 3, 4] as const,
  [2] as const,
  [4] as const,
)
const differenceDataLast = difference([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof differenceDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof differenceDataFirstRest, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof differenceDataLast, Array<1 | 2 | 3>>

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
const extraLeftRecords = [{ id: 1, leftOnly: "left" }] as const
const extraRightRecords = [{ id: 2, rightOnly: "right" }] as const
type InlineExtraLeftValue = { id: number; leftOnly: string }
type RecordValue = { id: number; group: string }
type NestedRecordValue = { user: { id: number }; name: string }

const differenceByDataFirst = difference(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const differenceByPathDataFirst = difference(leftRecords, rightRecords, "id")
const differenceByPathDataLast = difference(rightRecords, "id")(leftRecords)
const differenceByPathDataLastWithExtraProperties = difference(
  extraRightRecords,
  "id",
)(extraLeftRecords)
const differenceByFunctionDataLastWithInlineExtraProperties = difference(
  [{ id: 2, rightOnly: "right" }],
  (value: { id: number }) => value.id,
)([{ id: 1, leftOnly: "left" }])
const differenceByDotPathDataLast = difference(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof differenceByDataFirst, RecordValue[]>
true satisfies IsEqual<typeof differenceByPathDataFirst, RecordValue[]>
true satisfies IsEqual<typeof differenceByPathDataLast, RecordValue[]>
true satisfies IsEqual<
  typeof differenceByPathDataLastWithExtraProperties,
  Array<{ readonly id: 1; readonly leftOnly: "left" }>
>
true satisfies IsEqual<
  typeof differenceByFunctionDataLastWithInlineExtraProperties,
  InlineExtraLeftValue[]
>
true satisfies IsEqual<typeof differenceByDotPathDataLast, NestedRecordValue[]>

// @ts-expect-error data-last string selectors are checked once values are provided.
difference(rightRecords, "missing")(leftRecords)

// @ts-expect-error excluded values must be assignable to the input values.
difference([1, 2, 3] as const, ["zippy"] as const)

// @ts-expect-error additional excluded arrays must be assignable to the input values.
difference([1, 2, 3] as const, [2] as const, [4] as const)

// @ts-expect-error data-last excluded values are checked once values are provided.
difference(["zippy"] as const)([1, 2, 3] as const)

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { intersection } from "./intersection"

const intersectionDataFirst = intersection([1, 2, 3] as const, [2] as const)
const intersectionDataLast = intersection([2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof intersectionDataFirst, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof intersectionDataLast, Array<1 | 2 | 3>>

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

const intersectionByDataFirst = intersection(
  leftRecords,
  rightRecords,
  (value) => value.id,
)
const intersectionByPathDataFirst = intersection(
  leftRecords,
  rightRecords,
  "id",
)
const intersectionByPathDataLast = intersection(rightRecords, "id")(leftRecords)
const intersectionByPathDataLastWithExtraProperties = intersection(
  extraRightRecords,
  "id",
)(extraLeftRecords)
const intersectionByFunctionDataLastWithInlineExtraProperties = intersection(
  [{ id: 2, rightOnly: "right" }],
  (value: { id: number }) => value.id,
)([{ id: 1, leftOnly: "left" }])
const intersectionByDotPathDataLast = intersection(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof intersectionByDataFirst, RecordValue[]>
true satisfies IsEqual<typeof intersectionByPathDataFirst, RecordValue[]>
true satisfies IsEqual<typeof intersectionByPathDataLast, RecordValue[]>
true satisfies IsEqual<
  typeof intersectionByPathDataLastWithExtraProperties,
  Array<{ readonly id: 1; readonly leftOnly: "left" }>
>
true satisfies IsEqual<
  typeof intersectionByFunctionDataLastWithInlineExtraProperties,
  InlineExtraLeftValue[]
>
true satisfies IsEqual<
  typeof intersectionByDotPathDataLast,
  NestedRecordValue[]
>

// @ts-expect-error data-last string selectors are checked once values are provided.
intersection(rightRecords, "missing")(leftRecords)

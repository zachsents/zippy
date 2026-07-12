// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
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
const unionByPathDataLastWithInlineExtraProperties = union(
  [{ id: 2, rightOnly: "right" }],
  "id",
)([{ id: 1, leftOnly: "left" }])
const unionByFunctionDataLastWithInlineExtraProperties = union(
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

const unionByDataFirst = union(leftRecords, rightRecords, (value) => value.id)
const unionByPathDataFirst = union(leftRecords, rightRecords, "id")
const unionByPathDataLast = union(rightRecords, "id")(leftRecords)
const unionByDotPathDataLast = union(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof unionByDataFirst, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByPathDataFirst, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByPathDataLast, RecordUnionValue[]>
true satisfies IsEqual<typeof unionByDotPathDataLast, NestedRecordUnionValue[]>
true satisfies IsEqual<
  typeof unionByPathDataLastWithInlineExtraProperties,
  InlineExtraUnionValue[]
>
true satisfies IsEqual<
  typeof unionByFunctionDataLastWithInlineExtraProperties,
  InlineExtraUnionValue[]
>

// @ts-expect-error string selectors must exist on the value type.
union(leftRecords, rightRecords, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
union(rightRecords, "missing")(leftRecords)

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { isDisjointFrom } from "./is-disjoint-from"

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

const isDisjointFromDataFirst = isDisjointFrom([1, 2] as const, [3] as const)
const isDisjointFromDataLast = isDisjointFrom([3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isDisjointFromDataFirst, boolean>
true satisfies IsEqual<typeof isDisjointFromDataLast, boolean>

const isDisjointFromByDataFirst = isDisjointFrom(
  leftRecords,
  rightRecords,
  "id",
)
const isDisjointFromByDataLast = isDisjointFrom(rightRecords, "id")(leftRecords)
const isDisjointFromByPathDataLastWithInlineExtraProperties = isDisjointFrom(
  [{ id: 2, rightOnly: "right" }],
  "id",
)([{ id: 1, leftOnly: "left" }])
const isDisjointFromByFunctionDataLastWithInlineExtraProperties =
  isDisjointFrom(
    [{ id: 2, rightOnly: "right" }],
    (value: { id: number }) => value.id,
  )([{ id: 1, leftOnly: "left" }])
const isDisjointFromByDotPathDataLast = isDisjointFrom(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isDisjointFromByDataFirst, boolean>
true satisfies IsEqual<typeof isDisjointFromByDataLast, boolean>
true satisfies IsEqual<
  typeof isDisjointFromByPathDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<
  typeof isDisjointFromByFunctionDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<typeof isDisjointFromByDotPathDataLast, boolean>

// @ts-expect-error data-last string selectors are checked once values are provided.
isDisjointFrom(rightRecords, "missing")(leftRecords)

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { isSubsetOf } from "./is-subset-of"

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

const isSubsetOfDataFirst = isSubsetOf([1, 2] as const, [1, 2, 3] as const)
const isSubsetOfDataLast = isSubsetOf([1, 2, 3] as const)([1, 2] as const)

true satisfies IsEqual<typeof isSubsetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSubsetOfDataLast, boolean>

const isSubsetOfByDataFirst = isSubsetOf(leftRecords, rightRecords, "id")
const isSubsetOfByDataLast = isSubsetOf(rightRecords, "id")(leftRecords)
const isSubsetOfByPathDataLastWithInlineExtraProperties = isSubsetOf(
  [{ id: 2, rightOnly: "right" }],
  "id",
)([{ id: 1, leftOnly: "left" }])
const isSubsetOfByFunctionDataLastWithInlineExtraProperties = isSubsetOf(
  [{ id: 2, rightOnly: "right" }],
  (value: { id: number }) => value.id,
)([{ id: 1, leftOnly: "left" }])
const isSubsetOfByDotPathDataLast = isSubsetOf(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isSubsetOfByDataFirst, boolean>
true satisfies IsEqual<typeof isSubsetOfByDataLast, boolean>
true satisfies IsEqual<
  typeof isSubsetOfByPathDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<
  typeof isSubsetOfByFunctionDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<typeof isSubsetOfByDotPathDataLast, boolean>

// @ts-expect-error data-last string selectors are checked once values are provided.
isSubsetOf(rightRecords, "missing")(leftRecords)

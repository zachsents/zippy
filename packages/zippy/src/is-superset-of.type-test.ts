// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { isSupersetOf } from "./is-superset-of"

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

const isSupersetOfDataFirst = isSupersetOf([1, 2, 3] as const, [1, 2] as const)
const isSupersetOfDataLast = isSupersetOf([1, 2] as const)([1, 2, 3] as const)

true satisfies IsEqual<typeof isSupersetOfDataFirst, boolean>
true satisfies IsEqual<typeof isSupersetOfDataLast, boolean>

const isSupersetOfByDataFirst = isSupersetOf(leftRecords, rightRecords, "id")
const isSupersetOfByDataLast = isSupersetOf(rightRecords, "id")(leftRecords)
const isSupersetOfByPathDataLastWithInlineExtraProperties = isSupersetOf(
  [{ id: 2, rightOnly: "right" }],
  "id",
)([{ id: 1, leftOnly: "left" }])
const isSupersetOfByFunctionDataLastWithInlineExtraProperties = isSupersetOf(
  [{ id: 2, rightOnly: "right" }],
  (value: { id: number }) => value.id,
)([{ id: 1, leftOnly: "left" }])
const isSupersetOfByDotPathDataLast = isSupersetOf(
  nestedRightRecords,
  "user.id",
)(nestedLeftRecords)

true satisfies IsEqual<typeof isSupersetOfByDataFirst, boolean>
true satisfies IsEqual<typeof isSupersetOfByDataLast, boolean>
true satisfies IsEqual<
  typeof isSupersetOfByPathDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<
  typeof isSupersetOfByFunctionDataLastWithInlineExtraProperties,
  boolean
>
true satisfies IsEqual<typeof isSupersetOfByDotPathDataLast, boolean>

// @ts-expect-error data-last string selectors are checked once values are provided.
isSupersetOf(rightRecords, "missing")(leftRecords)

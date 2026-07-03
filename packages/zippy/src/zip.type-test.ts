// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { zip } from "./zip"

const zipDataFirst = zip(["a", "b"] as const, [1, 2] as const)
const zipDataLast = zip([1, 2] as const)(["a", "b"] as const)
const zipMergerDataFirst = zip(
  ["a", "b"] as const,
  [1, 2] as const,
  (leftValue, rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
)
const zipMergerDataLast = zip(
  [1, 2] as const,
  (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
)(["a", "b"] as const)

true satisfies IsEqual<typeof zipDataFirst, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipDataLast, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipMergerDataFirst, Array<"first" | "other">>
true satisfies IsEqual<typeof zipMergerDataLast, Array<"first" | "other">>

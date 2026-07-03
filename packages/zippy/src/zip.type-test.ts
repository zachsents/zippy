// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { zip, zipCustom, zipWith } from "./zip"

const zipDataFirst = zip(["a", "b"] as const, [1, 2] as const)
const zipDataLast = zip([1, 2] as const)(["a", "b"] as const)

true satisfies IsEqual<typeof zipDataFirst, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipDataLast, Array<["a" | "b", 1 | 2]>>

const zipWithDataFirst = zipWith(
  ["a", "b"] as const,
  [1, 2] as const,
  (leftValue, rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
)
const zipWithDataLast = zipWith(
  [1, 2] as const,
  (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
)(["a", "b"] as const)

true satisfies IsEqual<typeof zipWithDataFirst, Array<"first" | "other">>
true satisfies IsEqual<typeof zipWithDataLast, Array<"first" | "other">>

const zipCustomDataFirst = zipCustom(["a", "b"] as const, [1, 2] as const)
const zipCustomDataLast = zipCustom([1, 2] as const)(["a", "b"] as const)
const zipCustomMatcherDataFirst = zipCustom(
  ["a", "b"] as const,
  [1, 2] as const,
  {
    matcher: (leftValue, rightValue) => leftValue === "a" && rightValue === 1,
  },
)
const zipCustomMatcherDataLast = zipCustom([1, 2] as const, {
  matcher: (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1,
})(["a", "b"] as const)
const zipCustomPathMatcherDataFirst = zipCustom(
  [{ id: "a" }, { id: "b" }] as const,
  [{ id: "b" }, { id: "a" }] as const,
  { matcher: "id" },
)
const zipCustomDotPathMatcherDataFirst = zipCustom(
  [{ user: { id: "a" } }, { user: { id: "b" } }] as const,
  [{ user: { id: "b" } }, { user: { id: "a" } }] as const,
  { matcher: "user.id" },
)
const zipCustomPathMatcherDataLast = zipCustom(
  [{ id: "b" }, { id: "a" }] as const,
  { matcher: "id" },
)([{ id: "a" }, { id: "b" }] as const)
const zipCustomMergerDataFirst = zipCustom(
  ["a", "b"] as const,
  [1, 2] as const,
  {
    merger: (leftValue, rightValue) =>
      leftValue === "a" && rightValue === 1 ? "first" : "other",
  },
)
const zipCustomMergerDataLast = zipCustom([1, 2] as const, {
  merger: (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
})(["a", "b"] as const)
const zipCustomPathMatcherMergerDataFirst = zipCustom(
  [{ id: "a" }, { id: "b" }] as const,
  [
    { id: "b", count: 2 },
    { id: "a", count: 1 },
  ] as const,
  {
    matcher: "id",
    merger: (leftValue, rightValue) =>
      leftValue.id === "a" && rightValue.count === 1 ? "first" : "other",
  },
)

true satisfies IsEqual<typeof zipCustomDataFirst, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipCustomDataLast, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<
  typeof zipCustomMatcherDataFirst,
  Array<["a" | "b", 1 | 2]>
>
true satisfies IsEqual<
  typeof zipCustomMatcherDataLast,
  Array<["a" | "b", 1 | 2]>
>
true satisfies IsEqual<
  typeof zipCustomPathMatcherDataFirst,
  Array<
    [
      { readonly id: "a" } | { readonly id: "b" },
      { readonly id: "b" } | { readonly id: "a" },
    ]
  >
>
true satisfies IsEqual<
  typeof zipCustomDotPathMatcherDataFirst,
  Array<
    [
      (
        | { readonly user: { readonly id: "a" } }
        | { readonly user: { readonly id: "b" } }
      ),
      (
        | { readonly user: { readonly id: "b" } }
        | { readonly user: { readonly id: "a" } }
      ),
    ]
  >
>
true satisfies IsEqual<
  typeof zipCustomPathMatcherDataLast,
  Array<
    [
      { readonly id: "a" } | { readonly id: "b" },
      { readonly id: "b" } | { readonly id: "a" },
    ]
  >
>
true satisfies IsEqual<
  typeof zipCustomMergerDataFirst,
  Array<"first" | "other">
>
true satisfies IsEqual<typeof zipCustomMergerDataLast, Array<"first" | "other">>
true satisfies IsEqual<
  typeof zipCustomPathMatcherMergerDataFirst,
  Array<"first" | "other">
>

// @ts-expect-error string matchers must exist on both sides.
zipCustom([{ id: 1 }] as const, [{ name: "one" }] as const, { matcher: "id" })

// @ts-expect-error data-last string matchers must exist on the bound right side.
zipCustom([{ name: "one" }] as const, { matcher: "id" })

// @ts-expect-error data-last string matchers are checked once left values are provided.
zipCustom([{ id: 1 }] as const, { matcher: "id" })([{ name: "one" }] as const)

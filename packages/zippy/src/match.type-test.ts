// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { match, matchMerge } from "./match"

const matchDataFirst = match(["a", "b"] as const, [1, 2] as const)
const matchDataLast = match([1, 2] as const)(["a", "b"] as const)
const matchMatcherDataFirst = match(["a", "b"] as const, [1, 2] as const, {
  matcher: (leftValue, rightValue) => leftValue === "a" && rightValue === 1,
})
const matchMatcherDataLast = match([1, 2] as const, {
  matcher: (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1,
})(["a", "b"] as const)
const matchPathMatcherDataFirst = match(
  [{ id: "a" }, { id: "b" }] as const,
  [{ id: "b" }, { id: "a" }] as const,
  { matcher: "id" },
)
const matchDotPathMatcherDataFirst = match(
  [{ user: { id: "a" } }, { user: { id: "b" } }] as const,
  [{ user: { id: "b" } }, { user: { id: "a" } }] as const,
  { matcher: "user.id" },
)
const matchPathMatcherDataLast = match([{ id: "b" }, { id: "a" }] as const, {
  matcher: "id",
})([{ id: "a" }, { id: "b" }] as const)
const matchMergerDataFirst = match(["a", "b"] as const, [1, 2] as const, {
  merger: (leftValue, rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
})
const matchMergerDataLast = match([1, 2] as const, {
  merger: (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
})(["a", "b"] as const)
const matchPathMatcherMergerDataFirst = match(
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

const matchMergeDataFirst = matchMerge(
  [{ id: "a", label: "A" }],
  [{ id: "a", count: 1 }],
)
const matchMergeDataLast = matchMerge([{ id: "a", count: 1 }])([
  { id: "a", label: "A" },
])
const matchMergeMatcherDataFirst = matchMerge(
  [{ id: "a", label: "A" }],
  [{ id: "a", count: 1 }],
  (leftValue, rightValue) => leftValue.id === rightValue.id,
)
const matchMergeMatcherDataLast = matchMerge(
  [{ id: "a", count: 1 }],
  (leftValue: { id: string; label: string }, rightValue) =>
    leftValue.id === rightValue.id,
)([{ id: "a", label: "A" }])

true satisfies IsEqual<typeof matchDataFirst, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof matchDataLast, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof matchMatcherDataFirst, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof matchMatcherDataLast, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<
  typeof matchPathMatcherDataFirst,
  Array<
    [
      { readonly id: "a" } | { readonly id: "b" },
      { readonly id: "b" } | { readonly id: "a" },
    ]
  >
>
true satisfies IsEqual<
  typeof matchDotPathMatcherDataFirst,
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
  typeof matchPathMatcherDataLast,
  Array<
    [
      { readonly id: "a" } | { readonly id: "b" },
      { readonly id: "b" } | { readonly id: "a" },
    ]
  >
>
true satisfies IsEqual<typeof matchMergerDataFirst, Array<"first" | "other">>
true satisfies IsEqual<typeof matchMergerDataLast, Array<"first" | "other">>
true satisfies IsEqual<
  typeof matchPathMatcherMergerDataFirst,
  Array<"first" | "other">
>
true satisfies IsEqual<
  typeof matchMergeDataFirst,
  Array<{ id: string; label: string; count: number }>
>
true satisfies IsEqual<
  typeof matchMergeDataLast,
  Array<{ id: string; label: string; count: number }>
>
true satisfies IsEqual<
  typeof matchMergeMatcherDataFirst,
  Array<{ id: string; label: string; count: number }>
>
true satisfies IsEqual<
  typeof matchMergeMatcherDataLast,
  Array<{ id: string; label: string; count: number }>
>

// @ts-expect-error string matchers must exist on both sides.
match([{ id: 1 }] as const, [{ name: "one" }] as const, { matcher: "id" })

// @ts-expect-error data-last string matchers must exist on the bound right side.
match([{ name: "one" }] as const, { matcher: "id" })

// @ts-expect-error data-last string matchers are checked once left values are provided.
match([{ id: 1 }] as const, { matcher: "id" })([{ name: "one" }] as const)

// @ts-expect-error matchMerge requires left values to be objects.
matchMerge(["a"], [{ id: 1 }])

// @ts-expect-error matchMerge requires right values to be objects.
matchMerge([{ id: 1 }], [1])

// @ts-expect-error matchMerge accepts a matcher function, not a path matcher.
matchMerge([{ id: "a" }], [{ id: "a" }], "id")

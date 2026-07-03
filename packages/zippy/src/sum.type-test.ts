// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { sum, sumBy } from "./sum"

const sumDataFirst = sum([1, 2, 3] as const)
const sumDataLast = sum()([1, 2, 3] as const)

true satisfies IsEqual<typeof sumDataFirst, number>
true satisfies IsEqual<typeof sumDataLast, number>

const sumByDataFirst = sumBy(
  [{ count: 1 }, { count: 2 }] as const,
  (value) => value.count,
)
const sumByDataLast = sumBy((value: { readonly count: number }) => value.count)(
  [{ count: 1 }, { count: 2 }] as const,
)
const sumByPathDataFirst = sumBy([{ count: 1 }, { count: 2 }] as const, "count")
const sumByDotPathDataFirst = sumBy(
  [{ stats: { score: 1 } }, { stats: { score: 2 } }] as const,
  "stats.score",
)
const sumByPathDataLast = sumBy("count")([{ count: 1 }, { count: 2 }] as const)
const sumByDotPathDataLast = sumBy("stats.score")([
  { stats: { score: 1 } },
  { stats: { score: 2 } },
] as const)
const sumByTypedPathDataLast = sumBy<{
  readonly stats: { readonly score: number }
}>("stats.score")([{ stats: { score: 1 } }] as const)

true satisfies IsEqual<typeof sumByDataFirst, number>
true satisfies IsEqual<typeof sumByDataLast, number>
true satisfies IsEqual<typeof sumByPathDataFirst, number>
true satisfies IsEqual<typeof sumByDotPathDataFirst, number>
true satisfies IsEqual<typeof sumByPathDataLast, number>
true satisfies IsEqual<typeof sumByDotPathDataLast, number>
true satisfies IsEqual<typeof sumByTypedPathDataLast, number>

// @ts-expect-error string selectors must point to a number.
sumBy([{ count: 1, label: "one" }] as const, "label")

// @ts-expect-error string selectors must exist on the value type.
sumBy([{ count: 1 }] as const, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
sumBy("label")([{ count: 1, label: "one" }] as const)

// @ts-expect-error explicit data-last string selectors must point to a number.
sumBy<{ readonly count: number; readonly label: string }>("label")

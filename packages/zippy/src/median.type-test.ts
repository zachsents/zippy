// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { median, medianBy } from "./median"

const medianDataFirst = median([1, 2, 3] as const)
const medianDataLast = median()([1, 2, 3] as const)

true satisfies IsEqual<typeof medianDataFirst, number | undefined>
true satisfies IsEqual<typeof medianDataLast, number | undefined>

const medianByDataFirst = medianBy(
  [{ score: 1 }, { score: 2 }] as const,
  (value) => value.score,
)
const medianByDataLast = medianBy(
  (value: { readonly score: number }) => value.score,
)([{ score: 1 }, { score: 2 }] as const)
const medianByPathDataFirst = medianBy(
  [{ score: 1 }, { score: 2 }] as const,
  "score",
)
const medianByDotPathDataFirst = medianBy(
  [{ stats: { score: 1 } }, { stats: { score: 2 } }] as const,
  "stats.score",
)
const medianByPathDataLast = medianBy("score")([{ score: 1 }, { score: 2 }])
const medianByDotPathDataLast = medianBy("stats.score")([
  { stats: { score: 1 } },
  { stats: { score: 2 } },
])
const medianByTypedPathDataLast = medianBy<{
  readonly stats: { readonly score: number }
}>("stats.score")([{ stats: { score: 1 } }])

true satisfies IsEqual<typeof medianByDataFirst, number | undefined>
true satisfies IsEqual<typeof medianByDataLast, number | undefined>
true satisfies IsEqual<typeof medianByPathDataFirst, number | undefined>
true satisfies IsEqual<typeof medianByDotPathDataFirst, number | undefined>
true satisfies IsEqual<typeof medianByPathDataLast, number | undefined>
true satisfies IsEqual<typeof medianByDotPathDataLast, number | undefined>
true satisfies IsEqual<typeof medianByTypedPathDataLast, number | undefined>

// @ts-expect-error string selectors must point to a number.
medianBy([{ score: 1, label: "one" }] as const, "label")

// @ts-expect-error string selectors must exist on the value type.
medianBy([{ score: 1 }] as const, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
medianBy("label")([{ score: 1, label: "one" }])

// @ts-expect-error explicit data-last string selectors must point to a number.
medianBy<{ readonly score: number; readonly label: string }>("label")

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { mean, meanBy } from "./mean"

const meanDataFirst = mean([1, 2, 3] as const)
const meanDataLast = mean()([1, 2, 3] as const)

true satisfies IsEqual<typeof meanDataFirst, number | undefined>
true satisfies IsEqual<typeof meanDataLast, number | undefined>

const meanByDataFirst = meanBy(
  [{ score: 1 }, { score: 2 }] as const,
  (value) => value.score,
)
const meanByDataLast = meanBy(
  (value: { readonly score: number }) => value.score,
)([{ score: 1 }, { score: 2 }] as const)
const meanByPathDataFirst = meanBy(
  [{ score: 1 }, { score: 2 }] as const,
  "score",
)
const meanByDotPathDataFirst = meanBy(
  [{ stats: { score: 1 } }, { stats: { score: 2 } }] as const,
  "stats.score",
)
const meanByPathDataLast = meanBy("score")([{ score: 1 }, { score: 2 }])
const meanByDotPathDataLast = meanBy("stats.score")([
  { stats: { score: 1 } },
  { stats: { score: 2 } },
])
const meanByTypedPathDataLast = meanBy<{
  readonly stats: { readonly score: number }
}>("stats.score")([{ stats: { score: 1 } }])

true satisfies IsEqual<typeof meanByDataFirst, number | undefined>
true satisfies IsEqual<typeof meanByDataLast, number | undefined>
true satisfies IsEqual<typeof meanByPathDataFirst, number | undefined>
true satisfies IsEqual<typeof meanByDotPathDataFirst, number | undefined>
true satisfies IsEqual<typeof meanByPathDataLast, number | undefined>
true satisfies IsEqual<typeof meanByDotPathDataLast, number | undefined>
true satisfies IsEqual<typeof meanByTypedPathDataLast, number | undefined>

// @ts-expect-error string selectors must point to a number.
meanBy([{ score: 1, label: "one" }] as const, "label")

// @ts-expect-error string selectors must exist on the value type.
meanBy([{ score: 1 }] as const, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
meanBy("label")([{ score: 1, label: "one" }])

// @ts-expect-error explicit data-last string selectors must point to a number.
meanBy<{ readonly score: number; readonly label: string }>("label")

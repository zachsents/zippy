// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import {
  mean,
  meanBy,
  median,
  medianBy,
  mode,
  modeBy,
  sum,
  sumBy,
} from "./math"

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

true satisfies IsEqual<typeof sumByDataFirst, number>
true satisfies IsEqual<typeof sumByDataLast, number>

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

true satisfies IsEqual<typeof meanByDataFirst, number | undefined>
true satisfies IsEqual<typeof meanByDataLast, number | undefined>

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

true satisfies IsEqual<typeof medianByDataFirst, number | undefined>
true satisfies IsEqual<typeof medianByDataLast, number | undefined>

const modeDataFirst = mode([1, 2, 2] as const)
const modeDataLast = mode()([1, 2, 2] as const)

true satisfies IsEqual<typeof modeDataFirst, 1 | 2 | undefined>
true satisfies IsEqual<typeof modeDataLast, 1 | 2 | undefined>

const values = [
  { kind: "a", score: 1 },
  { kind: "b", score: 2 },
] as const

const modeByDataFirst = modeBy(values, (value) => value.kind)
const modeByDataLast = modeBy((value: (typeof values)[number]) => value.kind)(
  values,
)

true satisfies IsEqual<
  typeof modeByDataFirst,
  (typeof values)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByDataLast,
  (typeof values)[number] | undefined
>

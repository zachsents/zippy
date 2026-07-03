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

true satisfies IsEqual<typeof medianByDataFirst, number | undefined>
true satisfies IsEqual<typeof medianByDataLast, number | undefined>

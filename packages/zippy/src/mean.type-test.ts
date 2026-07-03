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

true satisfies IsEqual<typeof meanByDataFirst, number | undefined>
true satisfies IsEqual<typeof meanByDataLast, number | undefined>

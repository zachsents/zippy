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

true satisfies IsEqual<typeof sumByDataFirst, number>
true satisfies IsEqual<typeof sumByDataLast, number>

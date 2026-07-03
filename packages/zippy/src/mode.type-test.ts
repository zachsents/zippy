// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { mode, modeBy } from "./mode"

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

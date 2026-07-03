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
const modeByPathDataFirst = modeBy(values, "kind")
const modeByDotPathDataFirst = modeBy(
  [
    { meta: { kind: "a" }, score: 1 },
    { meta: { kind: "b" }, score: 2 },
  ] as const,
  "meta.kind",
)
const modeByPathDataLast = modeBy("kind")(values)
const modeByDotPathDataLast = modeBy("meta.kind")([
  { meta: { kind: "a" }, score: 1 },
  { meta: { kind: "b" }, score: 2 },
] as const)
const modeByTypedPathDataLast = modeBy<{
  readonly kind: string
  readonly score: number
}>("kind")([{ kind: "a", score: 1 }])

true satisfies IsEqual<
  typeof modeByDataFirst,
  (typeof values)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByDataLast,
  (typeof values)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByPathDataFirst,
  (typeof values)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByDotPathDataFirst,
  | { readonly meta: { readonly kind: "a" }; readonly score: 1 }
  | { readonly meta: { readonly kind: "b" }; readonly score: 2 }
  | undefined
>
true satisfies IsEqual<
  typeof modeByPathDataLast,
  (typeof values)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByDotPathDataLast,
  | { readonly meta: { readonly kind: "a" }; readonly score: 1 }
  | { readonly meta: { readonly kind: "b" }; readonly score: 2 }
  | undefined
>
true satisfies IsEqual<
  typeof modeByTypedPathDataLast,
  { readonly kind: string; readonly score: number } | undefined
>

// @ts-expect-error string selectors must exist on the value type.
modeBy(values, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
modeBy("missing")(values)

// @ts-expect-error explicit data-last string selectors must exist on the value type.
modeBy<{ readonly kind: string }>("missing")

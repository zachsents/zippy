// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { unique, uniqueBy } from "./unique"

const uniqueDataFirst = unique([1, 2, 1] as const)
const uniqueDataLast = unique()([1, 2, 1] as const)

true satisfies IsEqual<typeof uniqueDataFirst, Array<1 | 2>>
true satisfies IsEqual<typeof uniqueDataLast, Array<1 | 2>>

const uniqueByDataFirst = uniqueBy(
  [{ id: 1 }, { id: 2 }, { id: 1 }] as const,
  (value) => value.id,
)
const uniqueByDataLast = uniqueBy((value: { readonly id: number }) => value.id)(
  [{ id: 1 }, { id: 2 }, { id: 1 }] as const,
)
const uniqueByPathDataFirst = uniqueBy(
  [{ id: 1 }, { id: 2 }, { id: 1 }] as const,
  "id",
)
const uniqueByDotPathDataFirst = uniqueBy(
  [{ user: { id: 1 } }, { user: { id: 2 } }, { user: { id: 1 } }] as const,
  "user.id",
)
const uniqueByPathDataLast = uniqueBy("id")([
  { id: 1 },
  { id: 2 },
  { id: 1 },
] as const)
const uniqueByDotPathDataLast = uniqueBy("user.id")([
  { user: { id: 1 } },
  { user: { id: 2 } },
  { user: { id: 1 } },
] as const)

type UniqueByExpected = Array<{ readonly id: 1 } | { readonly id: 2 }>
type UniqueByWidenedExpected = Array<{ readonly id: number }>
type UniqueByDotPathExpected = Array<
  { readonly user: { readonly id: 1 } } | { readonly user: { readonly id: 2 } }
>

true satisfies IsEqual<typeof uniqueByDataFirst, UniqueByExpected>
true satisfies IsEqual<typeof uniqueByDataLast, UniqueByWidenedExpected>
true satisfies IsEqual<typeof uniqueByPathDataFirst, UniqueByExpected>
true satisfies IsEqual<typeof uniqueByDotPathDataFirst, UniqueByDotPathExpected>
true satisfies IsEqual<typeof uniqueByPathDataLast, UniqueByExpected>
true satisfies IsEqual<typeof uniqueByDotPathDataLast, UniqueByDotPathExpected>

// @ts-expect-error string selectors must exist on the value type.
uniqueBy([{ id: 1 }] as const, "missing")

// @ts-expect-error data-last string selectors are checked once values are provided.
uniqueBy("missing")([{ id: 1 }] as const)

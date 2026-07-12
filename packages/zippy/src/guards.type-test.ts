// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"

import {
  isFalsy,
  isDefined,
  isNullish,
  isNonNullish,
  isPlainObject,
  isTruthy,
  isUndefined,
  type Falsy,
} from "./guards"

const values = [
  0,
  1,
  "",
  "zippy",
  false,
  true,
  null,
  undefined,
  0n,
  2n,
] as const

const truthy = values.filter(isTruthy)
const falsy = values.filter(isFalsy)
const nonNullish = values.filter(isNonNullish)
const defined = values.filter(isDefined)
const narrowFalsy = [0, 1] as const satisfies ReadonlyArray<0 | 1>
const onlyZero = narrowFalsy.filter(isFalsy)

true satisfies IsEqual<typeof truthy, Array<1 | "zippy" | true | 2n>>
true satisfies IsEqual<typeof falsy, Falsy[]>
true satisfies IsEqual<
  typeof nonNullish,
  Array<0 | 1 | "" | "zippy" | false | true | 0n | 2n>
>
true satisfies IsEqual<
  typeof defined,
  Array<0 | 1 | "" | "zippy" | false | true | null | 0n | 2n>
>
true satisfies IsEqual<typeof onlyZero, 0[]>

declare const maybeNullish: number | null | undefined

if (isNullish(maybeNullish)) {
  true satisfies IsEqual<typeof maybeNullish, null | undefined>
} else {
  true satisfies IsEqual<typeof maybeNullish, number>
}

if (isNonNullish(maybeNullish)) {
  true satisfies IsEqual<typeof maybeNullish, number>
} else {
  true satisfies IsEqual<typeof maybeNullish, null | undefined>
}

declare const maybeUndefined: number | undefined

if (isUndefined(maybeUndefined)) {
  true satisfies IsEqual<typeof maybeUndefined, undefined>
} else {
  true satisfies IsEqual<typeof maybeUndefined, number>
}

if (isDefined(maybeUndefined)) {
  true satisfies IsEqual<typeof maybeUndefined, number>
} else {
  true satisfies IsEqual<typeof maybeUndefined, undefined>
}

declare const maybeVoid: number | void

if (isUndefined(maybeVoid)) {
  true satisfies IsEqual<typeof maybeVoid, void>
} else {
  true satisfies IsEqual<typeof maybeVoid, number>
}

if (isDefined(maybeVoid)) {
  true satisfies IsEqual<typeof maybeVoid, number>
} else {
  true satisfies IsEqual<typeof maybeVoid, void>
}

declare const maybeObject: unknown

if (isPlainObject(maybeObject)) {
  true satisfies IsEqual<typeof maybeObject, Record<PropertyKey, unknown>>
}

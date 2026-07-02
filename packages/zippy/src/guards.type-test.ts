// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"

import {
  isFalsy,
  isNull,
  isNullish,
  isPlainObject,
  isTruthy,
  isUndefined,
  type Falsy,
  type PlainObject,
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
const narrowFalsy = [0, 1] as const satisfies ReadonlyArray<0 | 1>
const onlyZero = narrowFalsy.filter(isFalsy)

true satisfies IsEqual<typeof truthy, Array<1 | "zippy" | true | 2n>>
true satisfies IsEqual<typeof falsy, Falsy[]>
true satisfies IsEqual<typeof onlyZero, 0[]>

declare const maybeNullish: number | null | undefined

if (isNullish(maybeNullish)) {
  true satisfies IsEqual<typeof maybeNullish, null | undefined>
} else {
  true satisfies IsEqual<typeof maybeNullish, number>
}

declare const maybeUndefined: number | undefined

if (isUndefined(maybeUndefined)) {
  true satisfies IsEqual<typeof maybeUndefined, undefined>
} else {
  true satisfies IsEqual<typeof maybeUndefined, number>
}

declare const maybeVoid: number | void

if (isUndefined(maybeVoid)) {
  true satisfies IsEqual<typeof maybeVoid, void>
} else {
  true satisfies IsEqual<typeof maybeVoid, number>
}

declare const maybeNull: string | null

if (isNull(maybeNull)) {
  true satisfies IsEqual<typeof maybeNull, null>
} else {
  true satisfies IsEqual<typeof maybeNull, string>
}

declare const maybeObject: unknown

if (isPlainObject(maybeObject)) {
  true satisfies IsEqual<typeof maybeObject, PlainObject>
}

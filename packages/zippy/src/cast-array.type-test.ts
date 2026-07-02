// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { castArray } from "./cast-array"

const castArrayDataFirst = castArray("zippy" as const)
const castArrayDataLast = castArray()("zippy" as const)

true satisfies IsEqual<typeof castArrayDataFirst, Array<"zippy">>
true satisfies IsEqual<typeof castArrayDataLast, Array<"zippy">>

const readonlyArrayDataFirst = castArray([1, 2] as const)
const readonlyArrayDataLast = castArray()([1, 2] as const)

true satisfies IsEqual<typeof readonlyArrayDataFirst, readonly [1, 2]>
true satisfies IsEqual<typeof readonlyArrayDataLast, readonly [1, 2]>

const mutableArray = [1, 2] as Array<1 | 2>
const mutableArrayDataFirst = castArray(mutableArray)
const mutableArrayDataLast = castArray()(mutableArray)

true satisfies IsEqual<typeof mutableArrayDataFirst, Array<1 | 2>>
true satisfies IsEqual<typeof mutableArrayDataLast, Array<1 | 2>>

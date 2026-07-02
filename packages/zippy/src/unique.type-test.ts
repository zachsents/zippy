// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import { unique } from "./unique"

const uniqueDataFirst = unique([1, 2, 1] as const)
const uniqueDataLast = unique()([1, 2, 1] as const)

true satisfies IsEqual<typeof uniqueDataFirst, Array<1 | 2>>
true satisfies IsEqual<typeof uniqueDataLast, Array<1 | 2>>

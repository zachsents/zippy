// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"

import { isReadonlyArray } from "./is-readonly-array"

declare const maybeReadonlyArray: unknown

if (isReadonlyArray(maybeReadonlyArray)) {
  true satisfies IsEqual<typeof maybeReadonlyArray, ReadonlyArray<unknown>>
}

declare const maybeStringOrReadonlyArray: null | ReadonlyArray<string>

if (isReadonlyArray(maybeStringOrReadonlyArray)) {
  true satisfies IsEqual<
    typeof maybeStringOrReadonlyArray,
    ReadonlyArray<string>
  >
}

const mixedValues: unknown[] = [
  1,
  ["zippy"] as const,
  { length: 1, 0: "zippy" },
  ["zip", "zap"] as const,
]

const arrays = mixedValues.filter(isReadonlyArray)

true satisfies IsEqual<typeof arrays, Array<ReadonlyArray<unknown>>>

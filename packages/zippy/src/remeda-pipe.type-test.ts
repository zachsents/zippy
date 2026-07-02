// This file is typechecked only and will never actually run.
import { pipe } from "remeda"
import type { IsEqual } from "type-fest"
import { castArray } from "./cast-array"
import {
  filter,
  filterOut,
  filterOutFalsy,
  filterOutNullish,
  filterOutUndefined,
} from "./filter"
import {
  map,
  mapAsync,
  mapEntries,
  mapEntriesAsync,
  mapKeys,
  mapKeysAsync,
  mapValues,
  mapValuesAsync,
} from "./map"
import {
  mean,
  meanBy,
  median,
  medianBy,
  mode,
  modeBy,
  sum,
  sumBy,
} from "./math"
import {
  difference,
  intersection,
  isDisjointFrom,
  isSubsetOf,
  isSupersetOf,
  symmetricDifference,
  union,
} from "./set"
import { unique } from "./unique"
import { zip, zipCustom, zipWith } from "./zip"

type AEntry = { kind: "a"; value: number }
type BEntry = { kind: "b"; value: string }
type Entry = AEntry | BEntry | null

declare function isAEntry(value: unknown): value is AEntry

const entries = [
  { kind: "a", value: 1 },
  { kind: "b", value: "two" },
  null,
] satisfies Entry[]

const castArrayPipe = pipe("zippy" as const, castArray())
const castReadonlyArrayPipe = pipe([1, 2] as const, castArray())
declare const maybeCastArrayValue: "zippy" | void
const castMaybePipe = pipe(
  maybeCastArrayValue,
  castArray(),
  map((value) => value),
)

true satisfies IsEqual<typeof castArrayPipe, Array<"zippy">>
true satisfies IsEqual<typeof castReadonlyArrayPipe, readonly [1, 2]>
true satisfies IsEqual<typeof castMaybePipe, Array<"zippy">>

const filterPipe = pipe(
  [1, 2, 3, 4] as const,
  filter((value: 1 | 2 | 3 | 4) => value > 1),
)
const filterGuardPipe = pipe(entries, filter(isAEntry))
const filterOutPipe = pipe(
  [1, 2, 3, 4] as const,
  filterOut((value: 1 | 2 | 3 | 4) => value > 1),
)
const filterOutGuardPipe = pipe(entries, filterOut(isAEntry))
const filterOutFalsyPipe = pipe(
  [0, 1, "", "zippy", false, true, null, undefined, 0n, 2n] as const,
  filterOutFalsy(),
)
const filterOutNullishPipe = pipe(
  [1, null, 2, undefined] as const,
  filterOutNullish(),
)
const filterOutUndefinedPipe = pipe(
  [1, null, undefined] as const,
  filterOutUndefined(),
)

true satisfies IsEqual<typeof filterPipe, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterGuardPipe, AEntry[]>
true satisfies IsEqual<typeof filterOutPipe, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterOutGuardPipe, Array<BEntry | null>>
true satisfies IsEqual<
  typeof filterOutFalsyPipe,
  Array<1 | "zippy" | true | 2n>
>
true satisfies IsEqual<typeof filterOutNullishPipe, Array<1 | 2>>
true satisfies IsEqual<typeof filterOutUndefinedPipe, Array<1 | null>>

const uniquePipe = pipe([1, 2, 1] as const, unique())
const mapPipe = pipe(
  [1, 2, 3] as const,
  map((value: 1 | 2 | 3) => (value === 1 ? "one" : "other")),
)
const mapAsyncPipe = pipe(
  [1, 2, 3] as const,
  mapAsync(async (value: 1 | 2 | 3) => (value === 1 ? "one" : "other")),
)

true satisfies IsEqual<typeof uniquePipe, Array<1 | 2>>
true satisfies IsEqual<typeof mapPipe, Array<"one" | "other">>
true satisfies IsEqual<typeof mapAsyncPipe, Promise<Array<"one" | "other">>>

const sumPipe = pipe([1, 2, 3] as const, sum())
const sumByPipe = pipe(
  [{ count: 1 }, { count: 2 }] as const,
  sumBy((value: { readonly count: number }) => value.count),
)
const meanPipe = pipe([1, 2, 3] as const, mean())
const meanByPipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  meanBy((value: { readonly score: number }) => value.score),
)
const medianPipe = pipe([1, 2, 3] as const, median())
const medianByPipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  medianBy((value: { readonly score: number }) => value.score),
)
const modePipe = pipe([1, 2, 2] as const, mode())
const modeValues = [
  { kind: "a", score: 1 },
  { kind: "b", score: 2 },
] as const
const modeByPipe = pipe(
  modeValues,
  modeBy((value: (typeof modeValues)[number]) => value.kind),
)

true satisfies IsEqual<typeof sumPipe, number>
true satisfies IsEqual<typeof sumByPipe, number>
true satisfies IsEqual<typeof meanPipe, number | undefined>
true satisfies IsEqual<typeof meanByPipe, number | undefined>
true satisfies IsEqual<typeof medianPipe, number | undefined>
true satisfies IsEqual<typeof medianByPipe, number | undefined>
true satisfies IsEqual<typeof modePipe, 1 | 2 | undefined>
true satisfies IsEqual<
  typeof modeByPipe,
  (typeof modeValues)[number] | undefined
>

const mapValuesPipe = pipe(
  { a: 1, b: 2 } as const,
  mapValues((value: 1 | 2) => (value === 1 ? "one" : "other")),
)
const mapValuesAsyncPipe = pipe(
  { a: 1, b: 2 } as const,
  mapValuesAsync(async (value: 1 | 2) => (value === 1 ? "one" : "other")),
)
const mapKeysPipe = pipe(
  { a: 1, b: 2 } as const,
  mapKeys((_value: 1 | 2, key) => (key === "a" ? "first" : "other")),
)
const mapKeysAsyncPipe = pipe(
  { a: 1, b: 2 } as const,
  mapKeysAsync(async (_value: 1 | 2, key) => (key === "a" ? "first" : "other")),
)
const mapEntriesPipe = pipe(
  { a: 1, b: 2 } as const,
  mapEntries(
    ([key, value]: readonly [string, 1 | 2]) =>
      [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
  ),
)
const mapEntriesAsyncPipe = pipe(
  { a: 1, b: 2 } as const,
  mapEntriesAsync(
    async ([key, value]: readonly [string, 1 | 2]) =>
      [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
  ),
)

true satisfies IsEqual<typeof mapValuesPipe, Record<string, "one" | "other">>
true satisfies IsEqual<
  typeof mapValuesAsyncPipe,
  Promise<Record<string, "one" | "other">>
>
true satisfies IsEqual<typeof mapKeysPipe, Record<"first" | "other", 1 | 2>>
true satisfies IsEqual<
  typeof mapKeysAsyncPipe,
  Promise<Record<"first" | "other", 1 | 2>>
>
true satisfies IsEqual<
  typeof mapEntriesPipe,
  Record<"first" | "other", "one" | "other">
>
true satisfies IsEqual<
  typeof mapEntriesAsyncPipe,
  Promise<Record<"first" | "other", "one" | "other">>
>

const unionPipe = pipe([1, 2] as const, union(["zippy"] as const))
const differencePipe = pipe([1, 2, 3] as const, difference([2] as const))
const intersectionPipe = pipe([1, 2, 3] as const, intersection([2] as const))
const symmetricDifferencePipe = pipe(
  [1, 2] as const,
  symmetricDifference(["zippy"] as const),
)
const isSubsetOfPipe = pipe([1, 2] as const, isSubsetOf([1, 2, 3] as const))
const isSupersetOfPipe = pipe([1, 2, 3] as const, isSupersetOf([1, 2] as const))
const isDisjointFromPipe = pipe([1, 2] as const, isDisjointFrom([3] as const))

true satisfies IsEqual<typeof unionPipe, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof differencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof intersectionPipe, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof symmetricDifferencePipe, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof isSubsetOfPipe, boolean>
true satisfies IsEqual<typeof isSupersetOfPipe, boolean>
true satisfies IsEqual<typeof isDisjointFromPipe, boolean>

const zipPipe = pipe(["a", "b"] as const, zip([1, 2] as const))
const zipWithPipe = pipe(
  ["a", "b"] as const,
  zipWith([1, 2] as const, (leftValue: "a" | "b", rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
  ),
)
const zipCustomPipe = pipe(["a", "b"] as const, zipCustom([1, 2] as const))
const zipCustomMatcherPipe = pipe(
  ["a", "b"] as const,
  zipCustom([1, 2] as const, {
    matcher: (leftValue: "a" | "b", rightValue) =>
      leftValue === "a" && rightValue === 1,
  }),
)
const zipCustomMergerPipe = pipe(
  ["a", "b"] as const,
  zipCustom([1, 2] as const, {
    merger: (leftValue: "a" | "b", rightValue) =>
      leftValue === "a" && rightValue === 1 ? "first" : "other",
  }),
)

true satisfies IsEqual<typeof zipPipe, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipWithPipe, Array<"first" | "other">>
true satisfies IsEqual<typeof zipCustomPipe, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipCustomMatcherPipe, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipCustomMergerPipe, Array<"first" | "other">>

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
import { mean, meanBy } from "./mean"
import { median, medianBy } from "./median"
import { deepMerge, merge } from "./merge"
import { mode, modeBy } from "./mode"
import { difference, differenceBy } from "./difference"
import { intersection, intersectionBy } from "./intersection"
import {
  isDisjointFrom,
  isDisjointFromBy,
  isSubsetOf,
  isSubsetOfBy,
  isSupersetOf,
  isSupersetOfBy,
} from "./set-predicates"
import {
  symmetricDifference,
  symmetricDifferenceBy,
} from "./symmetric-difference"
import { sum, sumBy } from "./sum"
import { union, unionBy } from "./union"
import { unique, uniqueBy } from "./unique"
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
const uniqueByPipe = pipe([{ id: 1 }, { id: 2 }, { id: 1 }], uniqueBy("id"))
const mapPipe = pipe(
  [1, 2, 3] as const,
  map((value: 1 | 2 | 3) => (value === 1 ? "one" : "other")),
)
const mapAsyncPipe = pipe(
  [1, 2, 3] as const,
  mapAsync(async (value: 1 | 2 | 3) => (value === 1 ? "one" : "other")),
)

true satisfies IsEqual<typeof uniquePipe, Array<1 | 2>>
true satisfies IsEqual<typeof uniqueByPipe, Array<{ id: number }>>
true satisfies IsEqual<typeof mapPipe, Array<"one" | "other">>
true satisfies IsEqual<typeof mapAsyncPipe, Promise<Array<"one" | "other">>>

const sumPipe = pipe([1, 2, 3] as const, sum())
const sumByPipe = pipe(
  [{ count: 1 }, { count: 2 }] as const,
  sumBy((value: { readonly count: number }) => value.count),
)
const sumByPathPipe = pipe(
  [{ count: 1 }, { count: 2 }] as const,
  sumBy("count"),
)
const meanPipe = pipe([1, 2, 3] as const, mean())
const meanByPipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  meanBy((value: { readonly score: number }) => value.score),
)
const meanByPathPipe = pipe([{ score: 1 }, { score: 2 }], meanBy("score"))
const medianPipe = pipe([1, 2, 3] as const, median())
const medianByPipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  medianBy((value: { readonly score: number }) => value.score),
)
const medianByPathPipe = pipe([{ score: 1 }, { score: 2 }], medianBy("score"))
const modePipe = pipe([1, 2, 2] as const, mode())
const modeValues = [
  { kind: "a", score: 1 },
  { kind: "b", score: 2 },
] as const
const modeByPipe = pipe(
  modeValues,
  modeBy((value: (typeof modeValues)[number]) => value.kind),
)
const modeByPathPipe = pipe(modeValues, modeBy("kind"))

true satisfies IsEqual<typeof sumPipe, number>
true satisfies IsEqual<typeof sumByPipe, number>
true satisfies IsEqual<typeof sumByPathPipe, number>
true satisfies IsEqual<typeof meanPipe, number | undefined>
true satisfies IsEqual<typeof meanByPipe, number | undefined>
true satisfies IsEqual<typeof meanByPathPipe, number | undefined>
true satisfies IsEqual<typeof medianPipe, number | undefined>
true satisfies IsEqual<typeof medianByPipe, number | undefined>
true satisfies IsEqual<typeof medianByPathPipe, number | undefined>
true satisfies IsEqual<typeof modePipe, 1 | 2 | undefined>
true satisfies IsEqual<
  typeof modeByPipe,
  (typeof modeValues)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByPathPipe,
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
const mergePipe = pipe({ a: 1, b: "left" }, merge({ b: 2, c: true }))
const deepMergePipe = pipe(
  { config: { retries: 1, flags: { debug: false } }, enabled: true },
  deepMerge({ config: { timeout: 100, flags: { trace: true } } }),
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
true satisfies IsEqual<typeof mergePipe, { a: number; b: number; c: boolean }>
true satisfies IsEqual<
  typeof deepMergePipe,
  {
    config: {
      retries: number
      timeout: number
      flags: { debug: boolean; trace: boolean }
    }
    enabled: boolean
  }
>

const unionPipe = pipe([1, 2] as const, union(["zippy"] as const))
const byPipeLeft = [{ id: 1 }]
const byPipeRight = [{ id: 2 }]
type ByPipeUnion = Array<
  (typeof byPipeLeft)[number] | (typeof byPipeRight)[number]
>
const unionByPipe = pipe(byPipeLeft, unionBy(byPipeRight, "id"))
const differencePipe = pipe([1, 2, 3] as const, difference([2] as const))
const differenceByPipe = pipe(byPipeLeft, differenceBy(byPipeRight, "id"))
const intersectionPipe = pipe([1, 2, 3] as const, intersection([2] as const))
const intersectionByPipe = pipe(byPipeLeft, intersectionBy(byPipeRight, "id"))
const symmetricDifferencePipe = pipe(
  [1, 2] as const,
  symmetricDifference(["zippy"] as const),
)
const symmetricDifferenceByPipe = pipe(
  byPipeLeft,
  symmetricDifferenceBy(byPipeRight, "id"),
)
const isSubsetOfPipe = pipe([1, 2] as const, isSubsetOf([1, 2, 3] as const))
const isSubsetOfByPipe = pipe(byPipeLeft, isSubsetOfBy(byPipeRight, "id"))
const isSupersetOfPipe = pipe([1, 2, 3] as const, isSupersetOf([1, 2] as const))
const isSupersetOfByPipe = pipe(byPipeLeft, isSupersetOfBy(byPipeRight, "id"))
const isDisjointFromPipe = pipe([1, 2] as const, isDisjointFrom([3] as const))
const isDisjointFromByPipe = pipe(
  byPipeLeft,
  isDisjointFromBy(byPipeRight, "id"),
)

true satisfies IsEqual<typeof unionPipe, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof unionByPipe, ByPipeUnion>
true satisfies IsEqual<typeof differencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<
  typeof differenceByPipe,
  Array<(typeof byPipeLeft)[number]>
>
true satisfies IsEqual<typeof intersectionPipe, Array<1 | 2 | 3>>
true satisfies IsEqual<
  typeof intersectionByPipe,
  Array<(typeof byPipeLeft)[number]>
>
true satisfies IsEqual<typeof symmetricDifferencePipe, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof symmetricDifferenceByPipe, ByPipeUnion>
true satisfies IsEqual<typeof isSubsetOfPipe, boolean>
true satisfies IsEqual<typeof isSubsetOfByPipe, boolean>
true satisfies IsEqual<typeof isSupersetOfPipe, boolean>
true satisfies IsEqual<typeof isSupersetOfByPipe, boolean>
true satisfies IsEqual<typeof isDisjointFromPipe, boolean>
true satisfies IsEqual<typeof isDisjointFromByPipe, boolean>

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
const zipCustomPathMatcherPipe = pipe(
  [{ id: "a" }, { id: "b" }],
  zipCustom([{ id: "b" }, { id: "a" }], { matcher: "id" }),
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
true satisfies IsEqual<
  typeof zipCustomPathMatcherPipe,
  Array<[{ id: string }, { id: string }]>
>
true satisfies IsEqual<typeof zipCustomMergerPipe, Array<"first" | "other">>

const castArrayInferencePipe = pipe("zippy" as const, castArray())
const filterInferencePipe = pipe(
  [1, 2, 3] as const,
  filter((value: 1 | 2 | 3) => value > 1),
)
const filterGuardInferencePipe = pipe(entries, filter(isAEntry))
const filterOutInferencePipe = pipe(
  [1, 2, 3] as const,
  filterOut((value: 1 | 2 | 3) => value > 1),
)
const filterOutGuardInferencePipe = pipe(entries, filterOut(isAEntry))
const filterOutFalsyInferencePipe = pipe(
  [0, 1, "", "zippy", false, true, null, undefined, 0n, 2n] as const,
  filterOutFalsy(),
)
const filterOutNullishInferencePipe = pipe(
  [1, null, 2, undefined] as const,
  filterOutNullish(),
)
const filterOutUndefinedInferencePipe = pipe(
  [1, null, undefined] as const,
  filterOutUndefined(),
)
const uniqueInferencePipe = pipe([1, 2, 1] as const, unique())
const uniqueByInferencePipe = pipe(
  [{ id: 1 }, { id: 2 }, { id: 1 }],
  uniqueBy("id"),
)
const mapInferencePipe = pipe(
  [1, 2, 3] as const,
  map((value) => (value === 1 ? "one" : "other")),
)
const mapAsyncInferencePipe = pipe(
  [1, 2, 3] as const,
  mapAsync(async (value) => (value === 1 ? "one" : "other")),
)
const sumInferencePipe = pipe([1, 2, 3] as const, sum())
const sumByInferencePipe = pipe(
  [{ count: 1 }, { count: 2 }] as const,
  sumBy((value) => value.count),
)
const sumByPathInferencePipe = pipe([{ hello: 5 }], sumBy("hello"))
const meanInferencePipe = pipe([1, 2, 3] as const, mean())
const meanByInferencePipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  meanBy((value) => value.score),
)
const meanByPathInferencePipe = pipe(
  [{ score: 1 }, { score: 2 }],
  meanBy("score"),
)
const medianInferencePipe = pipe([1, 2, 3] as const, median())
const medianByInferencePipe = pipe(
  [{ score: 1 }, { score: 2 }] as const,
  medianBy((value) => value.score),
)
const medianByPathInferencePipe = pipe(
  [{ score: 1 }, { score: 2 }],
  medianBy("score"),
)
const modeInferencePipe = pipe([1, 2, 2] as const, mode())
const modeByInferencePipe = pipe(
  modeValues,
  modeBy((value) => value.kind),
)
const modeByPathInferencePipe = pipe(modeValues, modeBy("kind"))
const mapValuesInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapValues((value) => (value === 1 ? "one" : "other")),
)
const mapValuesAsyncInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapValuesAsync(async (value) => (value === 1 ? "one" : "other")),
)
const mapKeysInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapKeys((_value, key) => (key === "a" ? "first" : "other")),
)
const mapKeysAsyncInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapKeysAsync(async (_value, key) => (key === "a" ? "first" : "other")),
)
const mapEntriesInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapEntries(
    ([key, value]) =>
      [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
  ),
)
const mapEntriesAsyncInferencePipe = pipe(
  { a: 1, b: 2 } as const,
  mapEntriesAsync(
    async ([key, value]) =>
      [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
  ),
)
const mergeInferencePipe = pipe({ a: 1, b: "left" }, merge({ b: 2, c: true }))
const deepMergeInferencePipe = pipe(
  { config: { retries: 1, flags: { debug: false } }, enabled: true },
  deepMerge({ config: { timeout: 100, flags: { trace: true } } }),
)
const unionInferencePipe = pipe([1, 2] as const, union(["zippy"] as const))
const byInferenceLeft = [{ id: 1 }]
const byInferenceRight = [{ id: 2 }]
type ByInferenceUnion = Array<
  (typeof byInferenceLeft)[number] | (typeof byInferenceRight)[number]
>
const unionByInferencePipe = pipe(
  byInferenceLeft,
  unionBy(byInferenceRight, "id"),
)
const differenceInferencePipe = pipe(
  [1, 2, 3] as const,
  difference([2] as const),
)
const differenceByInferencePipe = pipe(
  byInferenceLeft,
  differenceBy(byInferenceRight, "id"),
)
const intersectionInferencePipe = pipe(
  [1, 2, 3] as const,
  intersection([2] as const),
)
const intersectionByInferencePipe = pipe(
  byInferenceLeft,
  intersectionBy(byInferenceRight, "id"),
)
const symmetricDifferenceInferencePipe = pipe(
  [1, 2] as const,
  symmetricDifference(["zippy"] as const),
)
const symmetricDifferenceByInferencePipe = pipe(
  byInferenceLeft,
  symmetricDifferenceBy(byInferenceRight, "id"),
)
const isSubsetOfInferencePipe = pipe(
  [1, 2] as const,
  isSubsetOf([1, 2, 3] as const),
)
const isSubsetOfByInferencePipe = pipe(
  byInferenceLeft,
  isSubsetOfBy(byInferenceRight, "id"),
)
const isSupersetOfInferencePipe = pipe(
  [1, 2, 3] as const,
  isSupersetOf([1, 2] as const),
)
const isSupersetOfByInferencePipe = pipe(
  byInferenceLeft,
  isSupersetOfBy(byInferenceRight, "id"),
)
const isDisjointFromInferencePipe = pipe(
  [1, 2] as const,
  isDisjointFrom([3] as const),
)
const isDisjointFromByInferencePipe = pipe(
  byInferenceLeft,
  isDisjointFromBy(byInferenceRight, "id"),
)
const zipInferencePipe = pipe(["a", "b"] as const, zip([1, 2] as const))
const zipWithInferencePipe = pipe(
  ["a", "b"] as const,
  zipWith([1, 2] as const, (leftValue, rightValue) =>
    leftValue === "a" && rightValue === 1 ? "first" : "other",
  ),
)
const zipCustomInferencePipe = pipe(
  ["a", "b"] as const,
  zipCustom([1, 2] as const),
)
const zipCustomMatcherInferencePipe = pipe(
  ["a", "b"] as const,
  zipCustom([1, 2] as const, {
    matcher: (leftValue, rightValue) => leftValue === "a" && rightValue === 1,
  }),
)
const zipCustomPathMatcherInferencePipe = pipe(
  [{ id: "a" }, { id: "b" }],
  zipCustom([{ id: "b" }, { id: "a" }], { matcher: "id" }),
)
const zipCustomMergerInferencePipe = pipe(
  ["a", "b"] as const,
  zipCustom([1, 2] as const, {
    merger: (leftValue, rightValue) =>
      leftValue === "a" && rightValue === 1 ? "first" : "other",
  }),
)

true satisfies IsEqual<typeof castArrayInferencePipe, Array<"zippy">>
true satisfies IsEqual<typeof filterInferencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof filterGuardInferencePipe, AEntry[]>
true satisfies IsEqual<typeof filterOutInferencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<typeof filterOutGuardInferencePipe, Array<BEntry | null>>
true satisfies IsEqual<
  typeof filterOutFalsyInferencePipe,
  Array<1 | "zippy" | true | 2n>
>
true satisfies IsEqual<typeof filterOutNullishInferencePipe, Array<1 | 2>>
true satisfies IsEqual<typeof filterOutUndefinedInferencePipe, Array<1 | null>>
true satisfies IsEqual<typeof uniqueInferencePipe, Array<1 | 2>>
true satisfies IsEqual<typeof uniqueByInferencePipe, Array<{ id: number }>>
true satisfies IsEqual<typeof mapInferencePipe, Array<"one" | "other">>
true satisfies IsEqual<
  typeof mapAsyncInferencePipe,
  Promise<Array<"one" | "other">>
>
true satisfies IsEqual<typeof sumInferencePipe, number>
true satisfies IsEqual<typeof sumByInferencePipe, number>
true satisfies IsEqual<typeof sumByPathInferencePipe, number>
true satisfies IsEqual<typeof meanInferencePipe, number | undefined>
true satisfies IsEqual<typeof meanByInferencePipe, number | undefined>
true satisfies IsEqual<typeof meanByPathInferencePipe, number | undefined>
true satisfies IsEqual<typeof medianInferencePipe, number | undefined>
true satisfies IsEqual<typeof medianByInferencePipe, number | undefined>
true satisfies IsEqual<typeof medianByPathInferencePipe, number | undefined>
true satisfies IsEqual<typeof modeInferencePipe, 1 | 2 | undefined>
true satisfies IsEqual<
  typeof modeByInferencePipe,
  (typeof modeValues)[number] | undefined
>
true satisfies IsEqual<
  typeof modeByPathInferencePipe,
  (typeof modeValues)[number] | undefined
>
true satisfies IsEqual<
  typeof mapValuesInferencePipe,
  Record<string, "one" | "other">
>
true satisfies IsEqual<
  typeof mapValuesAsyncInferencePipe,
  Promise<Record<string, "one" | "other">>
>
true satisfies IsEqual<
  typeof mapKeysInferencePipe,
  Record<"first" | "other", 1 | 2>
>
true satisfies IsEqual<
  typeof mapKeysAsyncInferencePipe,
  Promise<Record<"first" | "other", 1 | 2>>
>
true satisfies IsEqual<
  typeof mapEntriesInferencePipe,
  Record<"first" | "other", "one" | "other">
>
true satisfies IsEqual<
  typeof mapEntriesAsyncInferencePipe,
  Promise<Record<"first" | "other", "one" | "other">>
>
true satisfies IsEqual<
  typeof mergeInferencePipe,
  { a: number; b: number; c: boolean }
>
true satisfies IsEqual<
  typeof deepMergeInferencePipe,
  {
    config: {
      retries: number
      timeout: number
      flags: { debug: boolean; trace: boolean }
    }
    enabled: boolean
  }
>
true satisfies IsEqual<typeof unionInferencePipe, Array<1 | 2 | "zippy">>
true satisfies IsEqual<typeof unionByInferencePipe, ByInferenceUnion>
true satisfies IsEqual<typeof differenceInferencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<
  typeof differenceByInferencePipe,
  Array<(typeof byInferenceLeft)[number]>
>
true satisfies IsEqual<typeof intersectionInferencePipe, Array<1 | 2 | 3>>
true satisfies IsEqual<
  typeof intersectionByInferencePipe,
  Array<(typeof byInferenceLeft)[number]>
>
true satisfies IsEqual<
  typeof symmetricDifferenceInferencePipe,
  Array<1 | 2 | "zippy">
>
true satisfies IsEqual<
  typeof symmetricDifferenceByInferencePipe,
  ByInferenceUnion
>
true satisfies IsEqual<typeof isSubsetOfInferencePipe, boolean>
true satisfies IsEqual<typeof isSubsetOfByInferencePipe, boolean>
true satisfies IsEqual<typeof isSupersetOfInferencePipe, boolean>
true satisfies IsEqual<typeof isSupersetOfByInferencePipe, boolean>
true satisfies IsEqual<typeof isDisjointFromInferencePipe, boolean>
true satisfies IsEqual<typeof isDisjointFromByInferencePipe, boolean>
true satisfies IsEqual<typeof zipInferencePipe, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<typeof zipWithInferencePipe, Array<"first" | "other">>
true satisfies IsEqual<typeof zipCustomInferencePipe, Array<["a" | "b", 1 | 2]>>
true satisfies IsEqual<
  typeof zipCustomMatcherInferencePipe,
  Array<["a" | "b", 1 | 2]>
>
true satisfies IsEqual<
  typeof zipCustomPathMatcherInferencePipe,
  Array<[{ id: string }, { id: string }]>
>
true satisfies IsEqual<
  typeof zipCustomMergerInferencePipe,
  Array<"first" | "other">
>

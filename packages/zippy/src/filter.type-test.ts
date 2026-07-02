// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import {
  filter,
  filterOut,
  filterOutFalsy,
  filterOutNullish,
  filterOutUndefined,
} from "./filter"

type AEntry = { kind: "a"; value: number }
type BEntry = { kind: "b"; value: string }
type Entry = AEntry | BEntry | null

declare function isAEntry(value: unknown): value is AEntry

const entries = [
  { kind: "a", value: 1 },
  { kind: "b", value: "two" },
  null,
] satisfies Entry[]

const filterDataFirst = filter([1, 2, 3, 4] as const, (value) => value > 1)
const filterDataLast = filter((value: 1 | 2 | 3 | 4) => value > 1)([
  1, 2, 3, 4,
] as const)
const filterGuardDataFirst = filter(entries, isAEntry)
const filterGuardDataLast = filter(isAEntry)(entries)

true satisfies IsEqual<typeof filterDataFirst, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterDataLast, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterGuardDataFirst, AEntry[]>
true satisfies IsEqual<typeof filterGuardDataLast, AEntry[]>

const filterOutDataFirst = filterOut(
  [1, 2, 3, 4] as const,
  (value) => value > 1,
)
const filterOutDataLast = filterOut((value: 1 | 2 | 3 | 4) => value > 1)([
  1, 2, 3, 4,
] as const)
const filterOutGuardDataFirst = filterOut(entries, isAEntry)
const filterOutGuardDataLast = filterOut(isAEntry)(entries)

true satisfies IsEqual<typeof filterOutDataFirst, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterOutDataLast, Array<1 | 2 | 3 | 4>>
true satisfies IsEqual<typeof filterOutGuardDataFirst, Array<BEntry | null>>
true satisfies IsEqual<typeof filterOutGuardDataLast, Array<BEntry | null>>

const truthyDataFirst = filterOutFalsy([
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
] as const)
const truthyDataLast = filterOutFalsy()([
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
] as const)

true satisfies IsEqual<typeof truthyDataFirst, Array<1 | "zippy" | true | 2n>>
true satisfies IsEqual<typeof truthyDataLast, Array<1 | "zippy" | true | 2n>>

const presentDataFirst = filterOutNullish([1, null, 2, undefined] as const)
const presentDataLast = filterOutNullish()([1, null, 2, undefined] as const)

true satisfies IsEqual<typeof presentDataFirst, Array<1 | 2>>
true satisfies IsEqual<typeof presentDataLast, Array<1 | 2>>

const definedDataFirst = filterOutUndefined([1, null, undefined] as const)
const definedDataLast = filterOutUndefined()([1, null, undefined] as const)

true satisfies IsEqual<typeof definedDataFirst, Array<1 | null>>
true satisfies IsEqual<typeof definedDataLast, Array<1 | null>>

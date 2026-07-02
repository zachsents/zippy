// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
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

const mapDataFirst = map([1, 2, 3] as const, (value) =>
  value === 1 ? "one" : "other",
)
const mapDataLast = map((value: 1 | 2 | 3) => (value === 1 ? "one" : "other"))([
  1, 2, 3,
] as const)

true satisfies IsEqual<typeof mapDataFirst, Array<"one" | "other">>
true satisfies IsEqual<typeof mapDataLast, Array<"one" | "other">>

const mapAsyncDataFirst = mapAsync([1, 2, 3] as const, async (value) =>
  value === 1 ? "one" : "other",
)
const mapAsyncDataLast = mapAsync(async (value: 1 | 2 | 3) =>
  value === 1 ? "one" : "other",
)([1, 2, 3] as const)

true satisfies IsEqual<
  typeof mapAsyncDataFirst,
  Promise<Array<"one" | "other">>
>
true satisfies IsEqual<typeof mapAsyncDataLast, Promise<Array<"one" | "other">>>

const mapValuesDataFirst = mapValues({ a: 1, b: 2 } as const, (value) =>
  value === 1 ? "one" : "other",
)
const mapValuesDataLast = mapValues((value: 1 | 2) =>
  value === 1 ? "one" : "other",
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapValuesDataFirst,
  Record<string, "one" | "other">
>
true satisfies IsEqual<
  typeof mapValuesDataLast,
  Record<string, "one" | "other">
>

const mapValuesAsyncDataFirst = mapValuesAsync(
  { a: 1, b: 2 } as const,
  async (value) => (value === 1 ? "one" : "other"),
)
const mapValuesAsyncDataLast = mapValuesAsync(async (value: 1 | 2) =>
  value === 1 ? "one" : "other",
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapValuesAsyncDataFirst,
  Promise<Record<string, "one" | "other">>
>
true satisfies IsEqual<
  typeof mapValuesAsyncDataLast,
  Promise<Record<string, "one" | "other">>
>

const mapKeysDataFirst = mapKeys({ a: 1, b: 2 } as const, (_value, key) =>
  key === "a" ? "first" : "other",
)
const mapKeysDataLast = mapKeys((_value: 1 | 2, key) =>
  key === "a" ? "first" : "other",
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapKeysDataFirst,
  Record<"first" | "other", 1 | 2>
>
true satisfies IsEqual<typeof mapKeysDataLast, Record<"first" | "other", 1 | 2>>

const mapKeysAsyncDataFirst = mapKeysAsync(
  { a: 1, b: 2 } as const,
  async (_value, key) => (key === "a" ? "first" : "other"),
)
const mapKeysAsyncDataLast = mapKeysAsync(async (_value: 1 | 2, key) =>
  key === "a" ? "first" : "other",
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapKeysAsyncDataFirst,
  Promise<Record<"first" | "other", 1 | 2>>
>
true satisfies IsEqual<
  typeof mapKeysAsyncDataLast,
  Promise<Record<"first" | "other", 1 | 2>>
>

const mapEntriesDataFirst = mapEntries(
  { a: 1, b: 2 } as const,
  ([key, value]) =>
    [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
)
const mapEntriesDataLast = mapEntries(
  ([key, value]: readonly [string, 1 | 2]) =>
    [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapEntriesDataFirst,
  Record<"first" | "other", "one" | "other">
>
true satisfies IsEqual<
  typeof mapEntriesDataLast,
  Record<"first" | "other", "one" | "other">
>

const mapEntriesAsyncDataFirst = mapEntriesAsync(
  { a: 1, b: 2 } as const,
  async ([key, value]) =>
    [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
)
const mapEntriesAsyncDataLast = mapEntriesAsync(
  async ([key, value]: readonly [string, 1 | 2]) =>
    [key === "a" ? "first" : "other", value === 1 ? "one" : "other"] as const,
)({ a: 1, b: 2 } as const)

true satisfies IsEqual<
  typeof mapEntriesAsyncDataFirst,
  Promise<Record<"first" | "other", "one" | "other">>
>
true satisfies IsEqual<
  typeof mapEntriesAsyncDataLast,
  Promise<Record<"first" | "other", "one" | "other">>
>

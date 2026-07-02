import { describe, expect, test } from "bun:test"

import {
  filter,
  filterOut,
  filterOutFalsy,
  filterOutNullish,
  filterOutUndefined,
} from "./filter"

type AEntry = { kind: "a"; value: number }

function isAEntry(value: unknown): value is AEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "a" &&
    "value" in value &&
    typeof value.value === "number"
  )
}

describe("filter", () => {
  test("keeps values matching a predicate", () => {
    expect(filter([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([2, 4])
  })

  test("keeps values matching a data-last predicate", () => {
    const keepEven: (values: readonly number[]) => number[] = filter(
      (value: number) => value % 2 === 0,
    )

    expect(keepEven([1, 2, 3, 4])).toEqual([2, 4])
  })

  test("keeps values matched by a type guard", () => {
    const entries = [{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]
    const onlyA = filter(entries, isAEntry)

    expect(onlyA).toEqual([{ kind: "a", value: 1 }])
  })

  test("keeps values matched by a data-last type guard", () => {
    const onlyAValues: (values: readonly unknown[]) => AEntry[] =
      filter(isAEntry)

    expect(
      onlyAValues([{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]),
    ).toEqual([{ kind: "a", value: 1 }])
  })
})

describe("filterOut", () => {
  test("removes values matching a predicate", () => {
    expect(filterOut([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([1, 3])
  })

  test("removes values matching a data-last predicate", () => {
    const removeEven: (values: readonly number[]) => number[] = filterOut(
      (value: number) => value % 2 === 0,
    )

    expect(removeEven([1, 2, 3, 4])).toEqual([1, 3])
  })

  test("removes values matched by a type guard", () => {
    const entries = [{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]
    const withoutA = filterOut(entries, isAEntry)

    expect(withoutA).toEqual([{ kind: "b", value: "two" }, null])
  })

  test("removes values matched by a data-last type guard", () => {
    const withoutAValues: (values: readonly (AEntry | null)[]) => null[] =
      filterOut(isAEntry)

    expect(withoutAValues([{ kind: "a", value: 1 }, null])).toEqual([null])
  })
})

describe("filter exclusion helpers", () => {
  test("removes falsy values", () => {
    const values = [0, 1, "", "zippy", false, true, null, undefined, 0n, 2n]
    const truthy = filterOutFalsy(values)

    expect(truthy).toEqual([1, "zippy", true, 2n])
  })

  test("removes falsy values data-last", () => {
    const keepTruthy: (
      values: readonly (0 | 1 | "" | "zippy" | false | true | null)[],
    ) => Array<1 | "zippy" | true> = filterOutFalsy()

    expect(keepTruthy([0, 1, "", "zippy", false, true, null])).toEqual([
      1,
      "zippy",
      true,
    ])
  })

  test("removes nullish values", () => {
    const values = [1, null, 2, undefined]
    const present = filterOutNullish(values)

    expect(present).toEqual([1, 2])
  })

  test("removes nullish values data-last", () => {
    const keepPresent: (
      values: readonly (number | null | undefined)[],
    ) => number[] = filterOutNullish()

    expect(keepPresent([1, null, 2, undefined])).toEqual([1, 2])
  })

  test("removes undefined values", () => {
    const values = [1, null, undefined]
    const defined = filterOutUndefined(values)

    expect(defined).toEqual([1, null])
  })

  test("removes undefined values data-last", () => {
    const keepDefined: (
      values: readonly (number | null | undefined)[],
    ) => Array<number | null> = filterOutUndefined()

    expect(keepDefined([1, null, undefined])).toEqual([1, null])
  })
})

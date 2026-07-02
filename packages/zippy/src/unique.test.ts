import { describe, expect, test } from "bun:test"

import { unique } from "./unique"

describe("unique", () => {
  test("returns values without duplicates", () => {
    expect(unique([1, 2, 1, 3, 2])).toEqual([1, 2, 3])
  })

  test("returns a pipeable function when called without values", () => {
    const uniqueValues: (values: readonly number[]) => number[] = unique()

    expect(uniqueValues([1, 2, 1, 3, 2])).toEqual([1, 2, 3])
    expect(unique()(["z", "i", "p", "p", "y"])).toEqual(["z", "i", "p", "y"])
  })

  test("preserves first occurrence order", () => {
    expect(unique(["z", "i", "p", "p", "y"])).toEqual(["z", "i", "p", "y"])
  })

  test("deduplicates by SameValueZero equality", () => {
    expect(unique([NaN, NaN, 0, -0])).toEqual([NaN, 0])
  })

  test("keeps distinct object references", () => {
    const first = { name: "zippy" }
    const second = { name: "zippy" }

    expect(unique([first, second, first])).toEqual([first, second])
  })
})

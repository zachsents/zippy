import { describe, expect, test } from "bun:test"

import { median, medianBy } from "./median"

describe("median", () => {
  test("returns the middle sorted number for odd-length arrays", () => {
    expect(median([9, 2, 4])).toBe(4)
  })

  test("returns the average of the middle sorted numbers for even-length arrays", () => {
    expect(median([10, 2, 4, 8])).toBe(6)
  })

  test("does not mutate the input array", () => {
    const values = [3, 1, 2]

    expect(median(values)).toBe(2)
    expect(values).toEqual([3, 1, 2])
  })

  test("returns undefined for an empty array", () => {
    expect(median([])).toBeUndefined()
  })

  test("returns the median data-last", () => {
    expect(median()([10, 2, 4, 8])).toBe(6)
  })
})

describe("medianBy", () => {
  test("returns the median of mapped numbers", () => {
    expect(
      medianBy(
        [{ score: 10 }, { score: 2 }, { score: 4 }, { score: 8 }],
        (value) => value.score,
      ),
    ).toBe(6)
  })

  test("returns undefined for an empty array", () => {
    expect(medianBy([], () => 1)).toBeUndefined()
  })

  test("returns the median of mapped numbers data-last", () => {
    expect(
      medianBy((value: { score: number }) => value.score)([
        { score: 10 },
        { score: 2 },
        { score: 4 },
        { score: 8 },
      ]),
    ).toBe(6)
  })
})

import { describe, expect, test } from "bun:test"

import { mean, meanBy } from "./mean"

describe("mean", () => {
  test("returns the arithmetic average", () => {
    expect(mean([2, 4, 9])).toBe(5)
  })

  test("returns undefined for an empty array", () => {
    expect(mean([])).toBeUndefined()
  })

  test("returns the arithmetic average data-last", () => {
    expect(mean()([2, 4, 9])).toBe(5)
  })
})

describe("meanBy", () => {
  test("returns the average of mapped numbers", () => {
    expect(
      meanBy(
        [{ score: 2 }, { score: 4 }, { score: 9 }],
        (value) => value.score,
      ),
    ).toBe(5)
  })

  test("returns the average of numbers selected by property path", () => {
    expect(meanBy([{ score: 2 }, { score: 4 }, { score: 9 }], "score")).toBe(5)
  })

  test("returns the average of numbers selected by dot path", () => {
    expect(
      meanBy(
        [
          { stats: { score: 2 } },
          { stats: { score: 4 } },
          { stats: { score: 9 } },
        ],
        "stats.score",
      ),
    ).toBe(5)
  })

  test("returns undefined for an empty array", () => {
    expect(meanBy([], () => 1)).toBeUndefined()
  })

  test("returns the average of mapped numbers data-last", () => {
    expect(
      meanBy((value: { score: number }) => value.score)([{ score: 2 }]),
    ).toBe(2)
  })

  test("returns the average of property path numbers data-last", () => {
    expect(meanBy("score")([{ score: 2 }])).toBe(2)
  })
})

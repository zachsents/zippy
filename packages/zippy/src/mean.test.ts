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

  test("returns undefined for an empty array", () => {
    expect(meanBy([], () => 1)).toBeUndefined()
  })

  test("returns the average of mapped numbers data-last", () => {
    expect(
      meanBy((value: { score: number }) => value.score)([{ score: 2 }]),
    ).toBe(2)
  })
})

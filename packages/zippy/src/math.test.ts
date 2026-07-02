import { describe, expect, test } from "bun:test"

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

describe("sum", () => {
  test("adds numbers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10)
  })

  test("returns zero for an empty array", () => {
    expect(sum([])).toBe(0)
  })

  test("adds numbers data-last", () => {
    expect(sum()([1, 2, 3, 4])).toBe(10)
  })
})

describe("sumBy", () => {
  test("adds mapped numbers", () => {
    expect(sumBy([{ count: 2 }, { count: 3 }], (value) => value.count)).toBe(5)
  })

  test("passes index and source array to the mapper", () => {
    const values = [{ count: 2 }, { count: 3 }]
    const sourcesMatch: boolean[] = []

    expect(
      sumBy(values, (value, index, source) => {
        sourcesMatch.push(source === values)

        return value.count + index
      }),
    ).toBe(6)
    expect(sourcesMatch).toEqual([true, true])
  })

  test("adds mapped numbers data-last", () => {
    expect(
      sumBy((value: { count: number }) => value.count)([{ count: 2 }]),
    ).toBe(2)
  })
})

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

describe("mode", () => {
  test("returns the most common value", () => {
    expect(mode(["z", "i", "p", "p", "y"])).toBe("p")
  })

  test("returns the first-occurring value when frequencies tie", () => {
    expect(mode(["a", "b", "b", "a"])).toBe("a")
  })

  test("returns undefined for an empty array", () => {
    expect(mode([])).toBeUndefined()
  })

  test("uses SameValueZero equality", () => {
    expect(mode([NaN, NaN, 0, -0, 0])).toBe(0)
  })

  test("keeps distinct object references", () => {
    const first = { name: "zippy" }
    const second = { name: "zippy" }

    expect(mode([first, second, first])).toBe(first)
  })

  test("returns the most common value data-last", () => {
    expect(mode()(["z", "i", "p", "p", "y"])).toBe("p")
  })
})

describe("modeBy", () => {
  test("returns the first value with the most common mapped key", () => {
    const firstA = { kind: "a", label: "first-a" }
    const b = { kind: "b", label: "b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(modeBy([firstA, b, secondA], (value) => value.kind)).toBe(firstA)
  })

  test("returns the first value whose mapped key is first in a tie", () => {
    const firstA = { kind: "a", label: "first-a" }
    const firstB = { kind: "b", label: "first-b" }
    const secondB = { kind: "b", label: "second-b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(
      modeBy([firstA, firstB, secondB, secondA], (value) => value.kind),
    ).toBe(firstA)
  })

  test("returns undefined for an empty array", () => {
    expect(modeBy([], () => "key")).toBeUndefined()
  })

  test("returns the first value with the most common mapped key data-last", () => {
    const firstA = { kind: "a", label: "first-a" }
    const b = { kind: "b", label: "b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(
      modeBy((value: { kind: string }) => value.kind)([firstA, b, secondA]),
    ).toBe(firstA)
  })
})

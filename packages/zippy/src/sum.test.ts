import { describe, expect, test } from "bun:test"

import { sum, sumBy } from "./sum"

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

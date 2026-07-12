import { describe, expect, test } from "bun:test"

import { isDisjointFrom } from "./is-disjoint-from"

describe("isDisjointFrom", () => {
  test("checks disjoint arrays", () => {
    expect(isDisjointFrom([1, 2], [3, 4])).toBe(true)
    expect(isDisjointFrom([1, 2], [2, 3])).toBe(false)
  })

  test("checks disjoint arrays data-last", () => {
    expect(isDisjointFrom([3, 4])([1, 2])).toBe(true)
    expect(isDisjointFrom([2, 3])([1, 2])).toBe(false)
  })

  test("uses SameValueZero equality", () => {
    expect(isDisjointFrom([0], [-0])).toBe(false)
  })
})

describe("isDisjointFrom selectors", () => {
  test("checks disjoint arrays by selected key", () => {
    expect(isDisjointFrom([{ id: 1 }, { id: 2 }], [{ id: 3 }], "id")).toBe(true)
    expect(isDisjointFrom([{ id: 1 }, { id: 2 }], [{ id: 2 }], "id")).toBe(
      false,
    )
  })

  test("checks disjoint arrays by selected key data-last", () => {
    expect(isDisjointFrom([{ id: 3 }], "id")([{ id: 1 }, { id: 2 }])).toBe(true)
    expect(isDisjointFrom([{ id: 2 }], "id")([{ id: 1 }, { id: 2 }])).toBe(
      false,
    )
  })

  test("accepts a selector function data-last", () => {
    expect(
      isDisjointFrom(
        [{ id: 3 }],
        (value: { id: number }) => value.id,
      )([{ id: 1 }, { id: 2 }]),
    ).toBe(true)
  })
})

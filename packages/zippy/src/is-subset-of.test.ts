import { describe, expect, test } from "bun:test"

import { isSubsetOf } from "./is-subset-of"

describe("isSubsetOf", () => {
  test("checks subset relationships", () => {
    expect(isSubsetOf([1, 1, 2], [2, 1, 3])).toBe(true)
    expect(isSubsetOf([1, 4], [2, 1, 3])).toBe(false)
  })

  test("checks subset relationships data-last", () => {
    expect(isSubsetOf([2, 1, 3])([1, 1, 2])).toBe(true)
    expect(isSubsetOf([2, 1, 3])([1, 4])).toBe(false)
  })

  test("uses SameValueZero equality", () => {
    expect(isSubsetOf([NaN], [NaN])).toBe(true)
  })
})

describe("isSubsetOf selectors", () => {
  test("checks subset relationships by selected key", () => {
    expect(
      isSubsetOf(
        [{ id: 1 }, { id: 2 }],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      ),
    ).toBe(true)
    expect(
      isSubsetOf(
        [{ id: 1 }, { id: 4 }],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      ),
    ).toBe(false)
  })

  test("checks subset relationships by selected key data-last", () => {
    expect(
      isSubsetOf(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      )([{ id: 1 }, { id: 2 }]),
    ).toBe(true)
    expect(
      isSubsetOf(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      )([{ id: 1 }, { id: 4 }]),
    ).toBe(false)
  })

  test("accepts a selector function data-last", () => {
    expect(
      isSubsetOf(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        (value: { id: number }) => value.id,
      )([{ id: 1 }, { id: 2 }]),
    ).toBe(true)
  })
})

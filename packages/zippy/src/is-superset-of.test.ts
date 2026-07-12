import { describe, expect, test } from "bun:test"

import { isSupersetOf } from "./is-superset-of"

describe("isSupersetOf", () => {
  test("checks superset relationships", () => {
    expect(isSupersetOf([2, 1, 3], [1, 1, 2])).toBe(true)
    expect(isSupersetOf([2, 1, 3], [1, 4])).toBe(false)
  })

  test("checks superset relationships data-last", () => {
    expect(isSupersetOf([1, 1, 2])([2, 1, 3])).toBe(true)
    expect(isSupersetOf([1, 4])([2, 1, 3])).toBe(false)
  })

  test("uses SameValueZero equality", () => {
    expect(isSupersetOf([NaN], [NaN])).toBe(true)
  })
})

describe("isSupersetOf selectors", () => {
  test("checks superset relationships by selected key", () => {
    expect(
      isSupersetOf(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        [{ id: 1 }, { id: 2 }],
        "id",
      ),
    ).toBe(true)
    expect(
      isSupersetOf(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        [{ id: 1 }, { id: 4 }],
        "id",
      ),
    ).toBe(false)
  })

  test("checks superset relationships by selected key data-last", () => {
    expect(
      isSupersetOf(
        [{ id: 1 }, { id: 2 }],
        "id",
      )([{ id: 2 }, { id: 1 }, { id: 3 }]),
    ).toBe(true)
    expect(
      isSupersetOf(
        [{ id: 1 }, { id: 4 }],
        "id",
      )([{ id: 2 }, { id: 1 }, { id: 3 }]),
    ).toBe(false)
  })

  test("accepts a selector function data-last", () => {
    expect(
      isSupersetOf(
        [{ id: 1 }, { id: 2 }],
        (value: { id: number }) => value.id,
      )([{ id: 2 }, { id: 1 }, { id: 3 }]),
    ).toBe(true)
  })
})

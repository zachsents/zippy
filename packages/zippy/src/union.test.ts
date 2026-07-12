import { describe, expect, test } from "bun:test"

import { union } from "./union"

describe("union", () => {
  test("returns unique values from each array in first occurrence order", () => {
    expect(union([1, 2, 1], [2, 3], [3, 4])).toEqual([1, 2, 3, 4])
  })

  test("returns unique values from each array in first occurrence order data-last", () => {
    expect(union([2, 3])([1, 2, 1])).toEqual([1, 2, 3])
  })

  test("uses SameValueZero equality", () => {
    expect(union([NaN, NaN], [0, -0])).toEqual([NaN, 0])
  })
})

describe("union selectors", () => {
  test("returns unique values from each array by selected key", () => {
    expect(
      union(
        [
          { id: 1, name: "left one" },
          { id: 2, name: "left two" },
        ],
        [
          { id: 2, name: "right two" },
          { id: 3, name: "right three" },
        ],
        (value) => value.id,
      ),
    ).toEqual([
      { id: 1, name: "left one" },
      { id: 2, name: "left two" },
      { id: 3, name: "right three" },
    ])
  })

  test("accepts a property path selector data-last", () => {
    expect(
      union(
        [{ user: { id: 2 } }, { user: { id: 3 } }],
        "user.id",
      )([{ user: { id: 1 } }, { user: { id: 2 } }]),
    ).toEqual([{ user: { id: 1 } }, { user: { id: 2 } }, { user: { id: 3 } }])
  })
})

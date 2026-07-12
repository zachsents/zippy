import { describe, expect, test } from "bun:test"

import { symmetricDifference } from "./symmetric-difference"

describe("symmetricDifference", () => {
  test("returns unique values that appear in only one array", () => {
    expect(symmetricDifference([1, 2, 2, 3], [3, 4, 4, 5])).toEqual([
      1, 2, 4, 5,
    ])
  })

  test("returns unique values that appear in only one array data-last", () => {
    expect(symmetricDifference([3, 4, 4, 5])([1, 2, 2, 3])).toEqual([
      1, 2, 4, 5,
    ])
  })

  test("preserves left-only values before right-only values", () => {
    expect(symmetricDifference(["a", "b"], ["b", "c"])).toEqual(["a", "c"])
  })
})

describe("symmetricDifference selectors", () => {
  test("returns unique values that appear by selected key in only one array", () => {
    expect(
      symmetricDifference(
        [
          { id: 1, name: "left one" },
          { id: 2, name: "left two" },
          { id: 1, name: "duplicate one" },
        ],
        [
          { id: 2, name: "right two" },
          { id: 3, name: "right three" },
          { id: 3, name: "duplicate three" },
        ],
        (value) => value.id,
      ),
    ).toEqual([
      { id: 1, name: "left one" },
      { id: 3, name: "right three" },
    ])
  })

  test("accepts a property path selector data-last", () => {
    expect(
      symmetricDifference(
        [{ user: { id: 2 } }, { user: { id: 3 } }],
        "user.id",
      )([{ user: { id: 1 } }, { user: { id: 2 } }]),
    ).toEqual([{ user: { id: 1 } }, { user: { id: 3 } }])
  })
})

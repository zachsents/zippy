import { describe, expect, test } from "bun:test"

import { intersection } from "./intersection"

describe("intersection", () => {
  test("returns unique values from the first array present in every other array", () => {
    expect(intersection([1, 2, 2, 3, 4], [2, 3, 5], [0, 2, 3])).toEqual([2, 3])
  })

  test("returns unique values from the first array present in another array data-last", () => {
    expect(
      intersection(["z", "i", "p", "p", "y"])(["z", "p", "p", "x"]),
    ).toEqual(["z", "p"])
  })
})

describe("intersection selectors", () => {
  test("returns unique values from the first array present by selected key", () => {
    expect(
      intersection(
        [
          { id: 1, name: "one" },
          { id: 2, name: "two" },
          { id: 2, name: "duplicate two" },
          { id: 3, name: "three" },
        ],
        [{ id: 2 }, { id: 4 }],
        (value) => value.id,
      ),
    ).toEqual([{ id: 2, name: "two" }])
  })

  test("accepts a property path selector data-last", () => {
    expect(
      intersection(
        [{ user: { id: 2 } }, { user: { id: 4 } }],
        "user.id",
      )([
        { user: { id: 1 }, name: "one" },
        { user: { id: 2 }, name: "two" },
        { user: { id: 2 }, name: "duplicate two" },
      ]),
    ).toEqual([{ user: { id: 2 }, name: "two" }])
  })
})

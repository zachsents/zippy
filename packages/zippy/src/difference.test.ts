import { describe, expect, test } from "bun:test"

import { difference } from "./difference"

describe("difference", () => {
  test("returns unique values from the first array that are not excluded", () => {
    expect(difference([1, 2, 2, 3, 4], [2], [4, 5])).toEqual([1, 3])
  })

  test("returns unique values from the first array that are not excluded data-last", () => {
    expect(difference([2])([1, 2, 2, 3, 4])).toEqual([1, 3, 4])
  })

  test("keeps object references that are not excluded", () => {
    const kept = { id: 1 }
    const removed = { id: 2 }

    expect(difference([kept, removed, kept], [removed])).toEqual([kept])
  })
})

describe("difference selectors", () => {
  test("returns unique values from the first array missing by selected key", () => {
    expect(
      difference(
        [
          { id: 1, name: "one" },
          { id: 2, name: "two" },
          { id: 1, name: "duplicate one" },
          { id: 3, name: "three" },
        ],
        [{ id: 2 }],
        (value) => value.id,
      ),
    ).toEqual([
      { id: 1, name: "one" },
      { id: 3, name: "three" },
    ])
  })

  test("accepts a property path selector data-last", () => {
    expect(
      difference(
        [{ user: { id: 2 } }],
        "user.id",
      )([
        { user: { id: 1 }, name: "one" },
        { user: { id: 2 }, name: "two" },
        { user: { id: 1 }, name: "duplicate one" },
      ]),
    ).toEqual([{ user: { id: 1 }, name: "one" }])
  })
})

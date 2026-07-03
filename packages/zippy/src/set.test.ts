import { describe, expect, test } from "bun:test"

import { difference } from "./difference"
import { intersection } from "./intersection"
import { isDisjointFrom, isSubsetOf, isSupersetOf } from "./set-predicates"
import { symmetricDifference } from "./symmetric-difference"
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

describe("set predicates", () => {
  test("checks subset and superset relationships", () => {
    expect(isSubsetOf([1, 1, 2], [2, 1, 3])).toBe(true)
    expect(isSubsetOf([1, 4], [2, 1, 3])).toBe(false)
    expect(isSupersetOf([2, 1, 3], [1, 1, 2])).toBe(true)
  })

  test("checks subset and superset relationships data-last", () => {
    expect(isSubsetOf([2, 1, 3])([1, 1, 2])).toBe(true)
    expect(isSubsetOf([2, 1, 3])([1, 4])).toBe(false)
    expect(isSupersetOf([1, 1, 2])([2, 1, 3])).toBe(true)
  })

  test("checks disjoint arrays", () => {
    expect(isDisjointFrom([1, 2], [3, 4])).toBe(true)
    expect(isDisjointFrom([1, 2], [2, 3])).toBe(false)
  })

  test("checks disjoint arrays data-last", () => {
    expect(isDisjointFrom([3, 4])([1, 2])).toBe(true)
    expect(isDisjointFrom([2, 3])([1, 2])).toBe(false)
  })

  test("uses SameValueZero equality", () => {
    expect(isSubsetOf([NaN], [NaN])).toBe(true)
    expect(isDisjointFrom([0], [-0])).toBe(false)
  })
})

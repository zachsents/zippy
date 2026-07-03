import { describe, expect, test } from "bun:test"

import { difference, differenceBy } from "./difference"
import { intersection, intersectionBy } from "./intersection"
import {
  isDisjointFrom,
  isDisjointFromBy,
  isSubsetOf,
  isSubsetOfBy,
  isSupersetOf,
  isSupersetOfBy,
} from "./set-predicates"
import {
  symmetricDifference,
  symmetricDifferenceBy,
} from "./symmetric-difference"
import { union, unionBy } from "./union"

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

describe("unionBy", () => {
  test("returns unique values from each array by selected key", () => {
    expect(
      unionBy(
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
      unionBy(
        [{ user: { id: 2 } }, { user: { id: 3 } }],
        "user.id",
      )([{ user: { id: 1 } }, { user: { id: 2 } }]),
    ).toEqual([{ user: { id: 1 } }, { user: { id: 2 } }, { user: { id: 3 } }])
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

describe("differenceBy", () => {
  test("returns unique values from the first array missing by selected key", () => {
    expect(
      differenceBy(
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
      differenceBy(
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

describe("intersectionBy", () => {
  test("returns unique values from the first array present by selected key", () => {
    expect(
      intersectionBy(
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
      intersectionBy(
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

describe("symmetricDifferenceBy", () => {
  test("returns unique values that appear by selected key in only one array", () => {
    expect(
      symmetricDifferenceBy(
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
      symmetricDifferenceBy(
        [{ user: { id: 2 } }, { user: { id: 3 } }],
        "user.id",
      )([{ user: { id: 1 } }, { user: { id: 2 } }]),
    ).toEqual([{ user: { id: 1 } }, { user: { id: 3 } }])
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

describe("set predicate by variants", () => {
  test("checks subset and superset relationships by selected key", () => {
    expect(
      isSubsetOfBy(
        [{ id: 1 }, { id: 2 }],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      ),
    ).toBe(true)
    expect(
      isSubsetOfBy(
        [{ id: 1 }, { id: 4 }],
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      ),
    ).toBe(false)
    expect(
      isSupersetOfBy(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        [{ id: 1 }, { id: 2 }],
        "id",
      ),
    ).toBe(true)
  })

  test("checks subset and superset relationships by selected key data-last", () => {
    expect(
      isSubsetOfBy(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      )([{ id: 1 }, { id: 2 }]),
    ).toBe(true)
    expect(
      isSubsetOfBy(
        [{ id: 2 }, { id: 1 }, { id: 3 }],
        "id",
      )([{ id: 1 }, { id: 4 }]),
    ).toBe(false)
    expect(
      isSupersetOfBy(
        [{ id: 1 }, { id: 2 }],
        "id",
      )([{ id: 2 }, { id: 1 }, { id: 3 }]),
    ).toBe(true)
  })

  test("checks disjoint arrays by selected key", () => {
    expect(isDisjointFromBy([{ id: 1 }, { id: 2 }], [{ id: 3 }], "id")).toBe(
      true,
    )
    expect(isDisjointFromBy([{ id: 1 }, { id: 2 }], [{ id: 2 }], "id")).toBe(
      false,
    )
  })

  test("checks disjoint arrays by selected key data-last", () => {
    expect(isDisjointFromBy([{ id: 3 }], "id")([{ id: 1 }, { id: 2 }])).toBe(
      true,
    )
    expect(isDisjointFromBy([{ id: 2 }], "id")([{ id: 1 }, { id: 2 }])).toBe(
      false,
    )
  })
})

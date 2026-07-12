import { describe, expect, test } from "bun:test"

import { match, matchMerge } from "./match"

describe("match", () => {
  test("matches values with a custom matcher", () => {
    const leftB = { id: "b", label: "B" }
    const leftA = { id: "a", label: "A" }
    const leftMissing = { id: "missing", label: "Missing" }
    const rightA = { id: "a", count: 1 }
    const rightB = { id: "b", count: 2 }
    const rightDuplicateB = { id: "b", count: 3 }

    expect(
      match(
        [leftB, leftA, leftMissing],
        [rightA, rightB, rightDuplicateB],
        (leftValue, rightValue) => leftValue.id === rightValue.id,
      ),
    ).toEqual([
      [leftB, rightB],
      [leftA, rightA],
    ])
  })

  test("matches values with a property path matcher", () => {
    const leftB = { id: "b", label: "B" }
    const leftA = { id: "a", label: "A" }
    const leftMissing = { id: "missing", label: "Missing" }
    const rightA = { id: "a", count: 1 }
    const rightB = { id: "b", count: 2 }
    const rightDuplicateB = { id: "b", count: 3 }

    expect(
      match(
        [leftB, leftA, leftMissing],
        [rightA, rightB, rightDuplicateB],
        "id",
      ),
    ).toEqual([
      [leftB, rightB],
      [leftA, rightA],
    ])
  })

  test("matches values data-last with a dot path matcher", () => {
    const leftFirst = { user: { id: "first" }, label: "A" }
    const leftSecond = { user: { id: "second" }, label: "B" }
    const rightSecond = { user: { id: "second" }, count: 2 }
    const rightFirst = { user: { id: "first" }, count: 1 }

    expect(
      match([rightSecond, rightFirst], "user.id")([leftFirst, leftSecond]),
    ).toEqual([
      [leftFirst, rightFirst],
      [leftSecond, rightSecond],
    ])
  })

  test("matches values data-last with a custom matcher", () => {
    const leftA = { id: "a", label: "A" }
    const leftB = { id: "b", label: "B" }
    const rightB = { id: "b", count: 2 }
    const rightA = { id: "a", count: 1 }

    expect(
      match(
        [rightB, rightA],
        (leftValue: { id: string; label: string }, rightValue) =>
          leftValue.id === rightValue.id,
      )([leftA, leftB]),
    ).toEqual([
      [leftA, rightA],
      [leftB, rightB],
    ])
  })

  test("uses SameValueZero equality for property path matchers", () => {
    const leftNaN = { id: NaN, label: "left" }
    const rightNaN = { id: NaN, count: 1 }

    expect(match([leftNaN], [rightNaN], "id")).toEqual([[leftNaN, rightNaN]])
  })

  test("passes indexes and source arrays to the matcher", () => {
    const leftValues = ["z", "i"] as const
    const rightValues = ["skip", "z", "i"] as const
    const calls: Array<{
      leftIndex: number
      rightIndex: number
      leftValue: string
      rightValue: string
      sameSources: boolean
    }> = []

    expect(
      match(
        leftValues,
        rightValues,
        (leftValue, rightValue, leftIndex, rightIndex, left, right) => {
          calls.push({
            leftIndex,
            rightIndex,
            leftValue,
            rightValue,
            sameSources: left === leftValues && right === rightValues,
          })

          return leftValue === rightValue && leftIndex + 1 === rightIndex
        },
      ),
    ).toEqual([
      ["z", "z"],
      ["i", "i"],
    ])
    expect(calls).toEqual([
      {
        leftIndex: 0,
        rightIndex: 0,
        leftValue: "z",
        rightValue: "skip",
        sameSources: true,
      },
      {
        leftIndex: 0,
        rightIndex: 1,
        leftValue: "z",
        rightValue: "z",
        sameSources: true,
      },
      {
        leftIndex: 1,
        rightIndex: 0,
        leftValue: "i",
        rightValue: "skip",
        sameSources: true,
      },
      {
        leftIndex: 1,
        rightIndex: 2,
        leftValue: "i",
        rightValue: "i",
        sameSources: true,
      },
    ])
  })
})

describe("matchMerge", () => {
  test("matches and shallow merges objects with a property path matcher", () => {
    expect(
      matchMerge(
        [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
        [
          { id: "a", label: "right A", count: 1 },
          { id: "b", label: "right B", count: 2 },
        ],
        "id",
      ),
    ).toEqual([
      { id: "a", label: "right A", count: 1 },
      { id: "b", label: "right B", count: 2 },
    ])
  })

  test("matches and shallow merges objects with a matcher", () => {
    expect(
      matchMerge(
        [
          { id: "b", label: "B" },
          { id: "a", label: "A" },
          { id: "missing", label: "Missing" },
        ],
        [
          { id: "a", count: 1 },
          { id: "b", count: 2 },
          { id: "b", count: 3 },
        ],
        (leftValue, rightValue) => leftValue.id === rightValue.id,
      ),
    ).toEqual([
      { id: "b", label: "B", count: 2 },
      { id: "a", label: "A", count: 1 },
    ])
  })

  test("matches and shallow merges objects data-last with a path matcher", () => {
    expect(
      matchMerge(
        [
          { id: "second", count: 2 },
          { id: "first", count: 1 },
        ],
        "id",
      )([
        { id: "first", label: "A" },
        { id: "second", label: "B" },
      ]),
    ).toEqual([
      { id: "first", label: "A", count: 1 },
      { id: "second", label: "B", count: 2 },
    ])
  })

  test("matches and shallow merges objects data-last with a matcher", () => {
    expect(
      matchMerge(
        [
          { id: "second", count: 2 },
          { id: "first", count: 1 },
        ],
        (leftValue: { id: string; label: string }, rightValue) =>
          leftValue.id === rightValue.id,
      )([
        { id: "first", label: "A" },
        { id: "second", label: "B" },
      ]),
    ).toEqual([
      { id: "first", label: "A", count: 1 },
      { id: "second", label: "B", count: 2 },
    ])
  })
})

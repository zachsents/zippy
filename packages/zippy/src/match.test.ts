import { describe, expect, test } from "bun:test"

import { match, matchMerge } from "./match"

describe("match", () => {
  test("pairs values by index by default", () => {
    expect(match(["a", "b"], [1, 2])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("pairs values by index by default data-last", () => {
    expect(match([1, 2])(["a", "b"])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("matches values with a custom matcher", () => {
    const leftB = { id: "b", label: "B" }
    const leftA = { id: "a", label: "A" }
    const leftMissing = { id: "missing", label: "Missing" }
    const rightA = { id: "a", count: 1 }
    const rightB = { id: "b", count: 2 }
    const rightDuplicateB = { id: "b", count: 3 }

    expect(
      match([leftB, leftA, leftMissing], [rightA, rightB, rightDuplicateB], {
        matcher: (leftValue, rightValue) => leftValue.id === rightValue.id,
      }),
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
      match([leftB, leftA, leftMissing], [rightA, rightB, rightDuplicateB], {
        matcher: "id",
      }),
    ).toEqual([
      [leftB, rightB],
      [leftA, rightA],
    ])
  })

  test("matches values with a dot path matcher data-last", () => {
    expect(
      match(
        [
          { user: { id: "second" }, count: 2 },
          { user: { id: "first" }, count: 1 },
        ],
        {
          matcher: "user.id",
          merger: (
            leftValue: { user: { id: string }; label: string },
            rightValue,
          ) => `${leftValue.label}:${rightValue.count}`,
        },
      )([
        { user: { id: "first" }, label: "A" },
        { user: { id: "second" }, label: "B" },
      ]),
    ).toEqual(["A:1", "B:2"])
  })

  test("uses SameValueZero equality for property path matchers", () => {
    const leftNaN = { id: NaN, label: "left" }
    const rightNaN = { id: NaN, count: 1 }

    expect(match([leftNaN], [rightNaN], { matcher: "id" })).toEqual([
      [leftNaN, rightNaN],
    ])
  })

  test("merges matched values with a custom merger", () => {
    expect(
      match(["a", "b"], [1, 2], {
        merger: (leftValue, rightValue) => `${leftValue}:${rightValue}`,
      }),
    ).toEqual(["a:1", "b:2"])
  })

  test("uses matcher and merger data-last", () => {
    expect(
      match(
        [
          { id: "second", count: 2 },
          { id: "first", count: 1 },
        ],
        {
          matcher: (leftValue: { id: string; label: string }, rightValue) =>
            leftValue.id === rightValue.id,
          merger: (leftValue: { id: string; label: string }, rightValue) =>
            `${leftValue.label}:${rightValue.count}`,
        },
      )([
        { id: "first", label: "A" },
        { id: "second", label: "B" },
      ]),
    ).toEqual(["A:1", "B:2"])
  })

  test("passes indexes and source arrays to matcher and merger", () => {
    const leftValues = ["z", "i"]
    const rightValues = ["skip", "z", "i"]
    const matcherSourcesMatch: boolean[] = []
    const mergerSourcesMatch: boolean[] = []

    expect(
      match(leftValues, rightValues, {
        matcher: (
          leftValue,
          rightValue,
          leftIndex,
          rightIndex,
          left,
          right,
        ) => {
          matcherSourcesMatch.push(left === leftValues && right === rightValues)

          return leftValue === rightValue && leftIndex + 1 === rightIndex
        },
        merger: (leftValue, rightValue, leftIndex, rightIndex, left, right) => {
          mergerSourcesMatch.push(left === leftValues && right === rightValues)

          return `${leftIndex}:${rightIndex}:${leftValue}:${rightValue}`
        },
      }),
    ).toEqual(["0:1:z:z", "1:2:i:i"])
    expect(matcherSourcesMatch).toEqual([true, true, true, true])
    expect(mergerSourcesMatch).toEqual([true, true])
  })
})

describe("matchMerge", () => {
  test("shallow merges matched objects by index by default", () => {
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

  test("matches and shallow merges objects data-last", () => {
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

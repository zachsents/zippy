import { describe, expect, test } from "bun:test"

import { zip, zipCustom, zipWith } from "./zip"

describe("zip", () => {
  test("pairs values by index", () => {
    expect(zip(["a", "b"], [1, 2])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("pairs values by index data-last", () => {
    expect(zip([1, 2])(["a", "b"])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("truncates to the shorter array", () => {
    expect(zip(["a", "b"], [1, 2, 3])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
    expect(zip(["a", "b", "c"], [1, 2])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("preserves undefined values", () => {
    expect(zip([undefined, "b"], [1, undefined])).toEqual([
      [undefined, 1],
      ["b", undefined],
    ])
  })
})

describe("zipWith", () => {
  test("maps paired values by index", () => {
    expect(
      zipWith(["a", "b"], [1, 2], (leftValue, rightValue) => {
        return `${leftValue}:${rightValue}`
      }),
    ).toEqual(["a:1", "b:2"])
  })

  test("maps paired values by index data-last", () => {
    expect(
      zipWith([1, 2], (leftValue: string, rightValue) => {
        return `${leftValue}:${rightValue}`
      })(["a", "b"]),
    ).toEqual(["a:1", "b:2"])
  })

  test("truncates to the shorter array", () => {
    expect(
      zipWith(["a", "b", "c"], [1, 2], (leftValue, rightValue) => {
        return `${leftValue}:${rightValue}`
      }),
    ).toEqual(["a:1", "b:2"])
  })

  test("passes index and source arrays to the zipper", () => {
    const leftValues = ["z", "i"]
    const rightValues = [1, 2]
    const sourcesMatch: boolean[] = []

    expect(
      zipWith(
        leftValues,
        rightValues,
        (leftValue, rightValue, index, left, right) => {
          sourcesMatch.push(left === leftValues && right === rightValues)

          return `${index}:${leftValue}:${rightValue}`
        },
      ),
    ).toEqual(["0:z:1", "1:i:2"])
    expect(sourcesMatch).toEqual([true, true])
  })
})

describe("zipCustom", () => {
  test("pairs values by index by default", () => {
    expect(zipCustom(["a", "b"], [1, 2])).toEqual([
      ["a", 1],
      ["b", 2],
    ])
  })

  test("pairs values by index by default data-last", () => {
    expect(zipCustom([1, 2])(["a", "b"])).toEqual([
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
      zipCustom(
        [leftB, leftA, leftMissing],
        [rightA, rightB, rightDuplicateB],
        {
          matcher: (leftValue, rightValue) => leftValue.id === rightValue.id,
        },
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
      zipCustom(
        [leftB, leftA, leftMissing],
        [rightA, rightB, rightDuplicateB],
        { matcher: "id" },
      ),
    ).toEqual([
      [leftB, rightB],
      [leftA, rightA],
    ])
  })

  test("matches values with a dot path matcher data-last", () => {
    expect(
      zipCustom(
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

    expect(zipCustom([leftNaN], [rightNaN], { matcher: "id" })).toEqual([
      [leftNaN, rightNaN],
    ])
  })

  test("merges matched values with a custom merger", () => {
    expect(
      zipCustom(["a", "b"], [1, 2], {
        merger: (leftValue, rightValue) => `${leftValue}:${rightValue}`,
      }),
    ).toEqual(["a:1", "b:2"])
  })

  test("uses matcher and merger data-last", () => {
    expect(
      zipCustom(
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
      zipCustom(leftValues, rightValues, {
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

import { describe, expect, test } from "bun:test"

import { zip } from "./zip"

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

  test("merges paired values by index", () => {
    expect(
      zip(["a", "b"], [1, 2], (leftValue, rightValue) => {
        return `${leftValue}:${rightValue}`
      }),
    ).toEqual(["a:1", "b:2"])
  })

  test("merges paired values by index data-last", () => {
    expect(
      zip([1, 2], (leftValue: string, rightValue) => {
        return `${leftValue}:${rightValue}`
      })(["a", "b"]),
    ).toEqual(["a:1", "b:2"])
  })

  test("returns an empty array when either input is empty", () => {
    expect(zip([], [1, 2])).toEqual([])
    expect(zip(["a", "b"], [])).toEqual([])
    expect(zip([1, 2])([])).toEqual([])
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
    expect(
      zip(["a", "b", "c"], [1, 2], (leftValue, rightValue) => {
        return `${leftValue}:${rightValue}`
      }),
    ).toEqual(["a:1", "b:2"])
    expect(
      zip([1, 2], (leftValue: string, rightValue) => {
        return `${leftValue}:${rightValue}`
      })(["a", "b", "c"]),
    ).toEqual(["a:1", "b:2"])
  })

  test("preserves undefined values", () => {
    expect(zip([undefined, "b"], [1, undefined])).toEqual([
      [undefined, 1],
      ["b", undefined],
    ])
  })

  test("passes index and source arrays to the merger", () => {
    const leftValues = ["z", "i"]
    const rightValues = [1, 2]
    const sourcesMatch: boolean[] = []

    expect(
      zip(
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

  test("passes index and source arrays to data-last mergers", () => {
    const leftValues = ["z", "i"]
    const rightValues = [1, 2]
    const sourcesMatch: boolean[] = []

    expect(
      zip(rightValues, (leftValue: string, rightValue, index, left, right) => {
        sourcesMatch.push(left === leftValues && right === rightValues)

        return `${index}:${leftValue}:${rightValue}`
      })(leftValues),
    ).toEqual(["0:z:1", "1:i:2"])
    expect(sourcesMatch).toEqual([true, true])
  })
})

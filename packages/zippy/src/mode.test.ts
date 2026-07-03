import { describe, expect, test } from "bun:test"

import { mode, modeBy } from "./mode"

describe("mode", () => {
  test("returns the most common value", () => {
    expect(mode(["z", "i", "p", "p", "y"])).toBe("p")
  })

  test("returns the first-occurring value when frequencies tie", () => {
    expect(mode(["a", "b", "b", "a"])).toBe("a")
  })

  test("returns undefined for an empty array", () => {
    expect(mode([])).toBeUndefined()
  })

  test("uses SameValueZero equality", () => {
    expect(mode([NaN, NaN, 0, -0, 0])).toBe(0)
  })

  test("keeps distinct object references", () => {
    const first = { name: "zippy" }
    const second = { name: "zippy" }

    expect(mode([first, second, first])).toBe(first)
  })

  test("returns the most common value data-last", () => {
    expect(mode()(["z", "i", "p", "p", "y"])).toBe("p")
  })
})

describe("modeBy", () => {
  test("returns the first value with the most common mapped key", () => {
    const firstA = { kind: "a", label: "first-a" }
    const b = { kind: "b", label: "b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(modeBy([firstA, b, secondA], (value) => value.kind)).toBe(firstA)
  })

  test("returns the first value whose mapped key is first in a tie", () => {
    const firstA = { kind: "a", label: "first-a" }
    const firstB = { kind: "b", label: "first-b" }
    const secondB = { kind: "b", label: "second-b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(
      modeBy([firstA, firstB, secondB, secondA], (value) => value.kind),
    ).toBe(firstA)
  })

  test("returns undefined for an empty array", () => {
    expect(modeBy([], () => "key")).toBeUndefined()
  })

  test("returns the first value with the most common mapped key data-last", () => {
    const firstA = { kind: "a", label: "first-a" }
    const b = { kind: "b", label: "b" }
    const secondA = { kind: "a", label: "second-a" }

    expect(
      modeBy((value: { kind: string }) => value.kind)([firstA, b, secondA]),
    ).toBe(firstA)
  })
})

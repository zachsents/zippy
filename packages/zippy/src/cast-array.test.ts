import { describe, expect, test } from "bun:test"

import { castArray } from "./cast-array"

describe("castArray", () => {
  test("returns a pipeable function when called without a value", () => {
    expect(castArray()("zippy")).toEqual(["zippy"])
  })

  test("wraps non-array values", () => {
    expect(castArray("zippy")).toEqual(["zippy"])
    expect(castArray(undefined)).toEqual([undefined])
  })

  test("returns array values unchanged", () => {
    const value = [1, 2, 3]

    expect(castArray(value)).toBe(value)
    expect(castArray()(value)).toBe(value)
  })
})

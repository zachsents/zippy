import { describe, expect, test } from "bun:test"

import { castArray } from "./cast-array"

describe("castArray", () => {
  test("returns a pipeable function when called without a value", () => {
    expect(castArray()("zippy")).toEqual(["zippy"])
  })

  test("wraps non-array values", () => {
    expect(castArray("zippy")).toEqual(["zippy"])
  })

  test("returns an empty array for undefined values", () => {
    expect(castArray(undefined)).toEqual([])
    expect(castArray()(undefined)).toEqual([])
  })

  test("returns array values unchanged", () => {
    const value = [1, 2, 3]

    expect(castArray(value)).toBe(value)
    expect(castArray()(value)).toBe(value)
  })
})

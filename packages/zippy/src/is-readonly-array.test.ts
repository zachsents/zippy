import { describe, expect, test } from "bun:test"

import { isReadonlyArray } from "./is-readonly-array"

describe("isReadonlyArray", () => {
  test("detects array values", () => {
    const readonlyTuple = [1, 2] as const

    expect(isReadonlyArray([])).toBe(true)
    expect(isReadonlyArray(["zippy"])).toBe(true)
    expect(isReadonlyArray(readonlyTuple)).toBe(true)
  })

  test("rejects non-array values", () => {
    expect(isReadonlyArray(null)).toBe(false)
    expect(isReadonlyArray(undefined)).toBe(false)
    expect(isReadonlyArray("zippy")).toBe(false)
    expect(isReadonlyArray({ length: 1, 0: "zippy" })).toBe(false)
    expect(isReadonlyArray(new Set(["zippy"]))).toBe(false)
    expect(isReadonlyArray(new Uint8Array([1, 2]))).toBe(false)
  })
})

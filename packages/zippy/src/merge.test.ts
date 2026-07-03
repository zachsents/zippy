import { describe, expect, test } from "bun:test"

import { deepMerge, merge } from "./merge"

describe("merge", () => {
  test("returns a shallow merge where source values override destination values", () => {
    expect(
      merge(
        { name: "zippy", config: { retries: 1 }, enabled: false },
        { config: { retries: 2 }, enabled: true },
      ),
    ).toEqual({
      name: "zippy",
      config: { retries: 2 },
      enabled: true,
    })
  })

  test("returns a pipeable function", () => {
    expect(merge({ b: 2, c: 3 })({ a: 1, b: 1 })).toEqual({
      a: 1,
      b: 2,
      c: 3,
    })
  })

  test("does not mutate either input object", () => {
    const destination = { a: 1, b: 1 }
    const source = { b: 2, c: 3 }

    const result = merge(destination, source)

    expect(result).toEqual({ a: 1, b: 2, c: 3 })
    expect(destination).toEqual({ a: 1, b: 1 })
    expect(source).toEqual({ b: 2, c: 3 })
  })
})

describe("deepMerge", () => {
  test("recursively merges plain object values", () => {
    expect(
      deepMerge(
        {
          server: {
            host: "localhost",
            flags: { debug: false, trace: false },
          },
          tags: ["left"],
        },
        {
          server: {
            port: 3000,
            flags: { debug: true },
          },
          tags: ["right"],
        },
      ),
    ).toEqual({
      server: {
        host: "localhost",
        port: 3000,
        flags: { debug: true, trace: false },
      },
      tags: ["right"],
    })
  })

  test("returns a pipeable function", () => {
    expect(
      deepMerge({
        config: { timeout: 100 },
      })({
        config: { retries: 2 },
        enabled: true,
      }),
    ).toEqual({
      config: { retries: 2, timeout: 100 },
      enabled: true,
    })
  })

  test("replaces non-plain object values instead of recursing into them", () => {
    const start = new Date("2026-01-01T00:00:00.000Z")
    const end = new Date("2026-01-02T00:00:00.000Z")

    const result = deepMerge({ value: start }, { value: end })

    expect(result.value).toBe(end)
  })

  test("does not mutate either input object", () => {
    const destination = {
      config: {
        retries: 1,
        flags: { debug: false },
      },
    }
    const source = {
      config: {
        timeout: 100,
        flags: { trace: true },
      },
    }

    const result = deepMerge(destination, source)

    expect(result).toEqual({
      config: {
        retries: 1,
        timeout: 100,
        flags: { debug: false, trace: true },
      },
    })
    expect(destination).toEqual({
      config: {
        retries: 1,
        flags: { debug: false },
      },
    })
    expect(source).toEqual({
      config: {
        timeout: 100,
        flags: { trace: true },
      },
    })
  })
})

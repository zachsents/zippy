import { describe, expect, test } from "bun:test"

import {
  isFalsy,
  isNull,
  isNullish,
  isPlainObject,
  isTruthy,
  isUndefined,
} from "./guards"

describe("type guards", () => {
  test("detects nullish values", () => {
    expect(isNullish(null)).toBe(true)
    expect(isNullish(undefined)).toBe(true)
    expect(isNullish(false)).toBe(false)
    expect(isNullish(0)).toBe(false)
    expect(isNullish("")).toBe(false)
  })

  test("detects truthy values", () => {
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy("zippy")).toBe(true)
    expect(isTruthy({})).toBe(true)
    expect(isTruthy(0)).toBe(false)
    expect(isTruthy("")).toBe(false)
    expect(isTruthy(null)).toBe(false)
  })

  test("detects falsy values", () => {
    expect(isFalsy(false)).toBe(true)
    expect(isFalsy(0)).toBe(true)
    expect(isFalsy(0n)).toBe(true)
    expect(isFalsy("")).toBe(true)
    expect(isFalsy(null)).toBe(true)
    expect(isFalsy(undefined)).toBe(true)
    expect(isFalsy(Number.NaN)).toBe(true)
    expect(isFalsy("zippy")).toBe(false)
  })

  test("detects undefined", () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
  })

  test("detects null", () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
  })

  test("detects plain objects", () => {
    expect(isPlainObject({ name: "zippy" })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
    expect(isPlainObject(Object.create({ inherited: true }))).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject("zippy")).toBe(false)
  })
})

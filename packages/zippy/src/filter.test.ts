import { describe, expect, test } from "bun:test"

import { filter, filterOut } from "./filter"
import { isDefined, isNonNullish, isTruthy, propIsTruthy } from "./guards"

type AEntry = { kind: "a"; value: number }
type User = { name: string; email?: string | null }

function isAEntry(value: unknown): value is AEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "a" &&
    "value" in value &&
    typeof value.value === "number"
  )
}

describe("filter", () => {
  test("keeps values matching a predicate", () => {
    expect(filter([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([2, 4])
  })

  test("keeps values matching a data-last predicate", () => {
    const keepEven: (values: readonly number[]) => number[] = filter(
      (value: number) => value % 2 === 0,
    )

    expect(keepEven([1, 2, 3, 4])).toEqual([2, 4])
  })

  test("keeps values matched by a type guard", () => {
    const entries = [{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]
    const onlyA = filter(entries, isAEntry)

    expect(onlyA).toEqual([{ kind: "a", value: 1 }])
  })

  test("keeps values matched by a data-last type guard", () => {
    const onlyAValues: (values: readonly unknown[]) => AEntry[] =
      filter(isAEntry)

    expect(
      onlyAValues([{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]),
    ).toEqual([{ kind: "a", value: 1 }])
  })

  test("keeps values matched by a value guard", () => {
    const values = [0, 1, "", "zippy", false, true, null, undefined, 0n, 2n]
    const truthy = filter(values, isTruthy)

    expect(truthy).toEqual([1, "zippy", true, 2n])
  })

  test("keeps values matched by a data-last value guard", () => {
    const keepPresent: (
      values: readonly (number | null | undefined)[],
    ) => number[] = filter(isNonNullish)

    expect(keepPresent([1, null, 2, undefined])).toEqual([1, 2])
  })

  test("keeps values matched by a property guard", () => {
    const users: User[] = [
      { name: "Ada", email: "ada@example.com" },
      { name: "Linus", email: null },
      { name: "Grace" },
    ]

    expect(filter(users, propIsTruthy("email"))).toEqual([
      { name: "Ada", email: "ada@example.com" },
    ])
  })
})

describe("filterOut", () => {
  test("removes values matching a predicate", () => {
    expect(filterOut([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([1, 3])
  })

  test("removes values matching a data-last predicate", () => {
    const removeEven: (values: readonly number[]) => number[] = filterOut(
      (value: number) => value % 2 === 0,
    )

    expect(removeEven([1, 2, 3, 4])).toEqual([1, 3])
  })

  test("removes values matched by a type guard", () => {
    const entries = [{ kind: "a", value: 1 }, { kind: "b", value: "two" }, null]
    const withoutA = filterOut(entries, isAEntry)

    expect(withoutA).toEqual([{ kind: "b", value: "two" }, null])
  })

  test("removes values matched by a data-last type guard", () => {
    const withoutAValues: (values: readonly (AEntry | null)[]) => null[] =
      filterOut(isAEntry)

    expect(withoutAValues([{ kind: "a", value: 1 }, null])).toEqual([null])
  })

  test("removes values matched by a value guard", () => {
    const values = [1, null, undefined, void 0]
    const undefinedValues = filterOut(values, isDefined)

    expect(undefinedValues).toEqual([undefined, undefined])
  })

  test("removes values matched by a data-last value guard", () => {
    const removeDefined: (
      values: readonly (number | null | undefined | void)[],
    ) => Array<undefined | void> = filterOut(isDefined)

    expect(removeDefined([1, null, undefined, void 0])).toEqual([
      undefined,
      undefined,
    ])
  })

  test("removes values matched by a property guard", () => {
    const users: User[] = [
      { name: "Ada", email: "ada@example.com" },
      { name: "Linus", email: null },
      { name: "Grace" },
    ]

    expect(filterOut(users, propIsTruthy("email"))).toEqual([
      { name: "Linus", email: null },
      { name: "Grace" },
    ])
  })
})

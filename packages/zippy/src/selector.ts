import type { Get, Paths } from "type-fest"

export type SelectorFunction<T, Selected = unknown> = (
  value: T,
  index: number,
  values: readonly T[],
) => Selected

export type PropertyPath<T> = Extract<
  Paths<T, { bracketNotation: false }>,
  string
>

export type PropertyPathValue<T, Path extends PropertyPath<T>> = Get<T, Path>

export type PropertyPathByValue<T, Selected> =
  PropertyPath<T> extends infer Path extends string
    ? Path extends unknown
      ? Get<T, Path> extends Selected
        ? Path
        : never
      : never
    : never

export type ValueSelector<T, Selected> =
  | SelectorFunction<T, Selected>
  | PropertyPathByValue<T, Selected>

export type ValidPropertyPath<T, Path extends string, Selected> =
  Path extends PropertyPathByValue<T, Selected> ? unknown : never

function isPropertyContainer(
  value: unknown,
): value is { readonly [key: string]: unknown } {
  return (
    (typeof value === "object" && value !== null) || typeof value === "function"
  )
}

export function getPropertyPathValue(value: unknown, path: string) {
  let result = value

  for (const key of path.split(".")) {
    if (!isPropertyContainer(result)) return undefined
    result = result[key]
  }

  return result
}

export function selectValue<T, Selected>(
  selector: SelectorFunction<T, Selected>,
  value: T,
  index: number,
  values: readonly T[],
): Selected
export function selectValue<T>(
  selector: string,
  value: T,
  index: number,
  values: readonly T[],
): unknown
export function selectValue<T, Selected>(
  selector: SelectorFunction<T, Selected> | string,
  value: T,
  index: number,
  values: readonly T[],
): unknown
export function selectValue<T, Selected>(
  selector: SelectorFunction<T, Selected> | string,
  value: T,
  index: number,
  values: readonly T[],
) {
  if (typeof selector === "function") {
    return selector(value, index, values)
  }

  return getPropertyPathValue(value, selector)
}

export function selectNumber<T>(
  selector: SelectorFunction<T, number> | string,
  value: T,
  index: number,
  values: readonly T[],
) {
  if (typeof selector === "function") {
    return selector(value, index, values)
  }

  return Number(getPropertyPathValue(value, selector))
}

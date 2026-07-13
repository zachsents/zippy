export type IterableInput<T> = Iterable<T> & object

export function isIterableInput<T = unknown>(
  value: unknown,
): value is IterableInput<T> {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof (value as { readonly [Symbol.iterator]?: unknown })[
      Symbol.iterator
    ] === "function"
  )
}

export function toReadonlyArray<T>(values: IterableInput<T>): readonly T[] {
  return Array.isArray(values) ? values : Array.from(values)
}

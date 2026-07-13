import type { ArrayElement, If, IsNever, UnknownArray } from "type-fest"

type CastArrayResult<T> = [Exclude<T, void>] extends [infer E]
  ? If<
      IsNever<E>,
      [],
      [E] extends [UnknownArray]
        ? E
        : Array<E extends UnknownArray ? ArrayElement<E> : E>
    >
  : never

const castArrayImpl = (value: unknown) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export function castArray(): <T>(value: T) => CastArrayResult<T>
export function castArray<T>(value: T): CastArrayResult<T>
export function castArray(...args: [] | [unknown]) {
  if (args.length === 0) {
    return castArrayImpl
  }

  return castArrayImpl(args[0])
}

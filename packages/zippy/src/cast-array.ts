type CastArrayResult<T> = [Exclude<T, undefined | void>] extends [never]
  ? []
  : [Exclude<T, undefined | void>] extends [readonly unknown[]]
    ? Exclude<T, undefined | void>
    : Array<
        T extends readonly (infer Value)[] ? Value : Exclude<T, undefined | void>
      >

const impl = (value: unknown) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

export function castArray(): <T>(value: T) => CastArrayResult<T>
export function castArray<T extends readonly unknown[]>(value: T): T
export function castArray<T>(value: T): CastArrayResult<T>
export function castArray(...args: [] | [unknown]) {
  if (args.length === 0) {
    return impl
  }

  return impl(args[0])
}

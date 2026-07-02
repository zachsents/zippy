const impl = (value: unknown) => (Array.isArray(value) ? value : [value])

export function castArray(): <T>(
  value: T,
) => T extends readonly unknown[] ? T : T[]
export function castArray<T extends readonly unknown[]>(value: T): T
export function castArray<T>(value: T): T[]
export function castArray(...args: [] | [unknown]) {
  if (args.length === 0) {
    return impl
  }

  return impl(args[0])
}

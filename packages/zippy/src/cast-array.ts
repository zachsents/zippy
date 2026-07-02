function internalCastArray<T extends readonly unknown[]>(value: T): T
function internalCastArray<T>(value: T): T[]
function internalCastArray(value: unknown): readonly unknown[] | unknown[] {
  if (Array.isArray(value)) {
    return value
  }

  return [value]
}

export function castArray(): typeof internalCastArray
export function castArray<T extends readonly unknown[]>(value: T): T
export function castArray<T>(value: T): T[]
export function castArray(
  ...args: [] | [unknown]
): typeof internalCastArray | readonly unknown[] | unknown[] {
  if (args.length === 0) {
    return internalCastArray
  }

  return internalCastArray(args[0])
}

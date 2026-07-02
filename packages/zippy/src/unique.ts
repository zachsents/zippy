function internalUnique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values))
}

export function unique<T>(values: readonly T[]): T[]
export function unique(): <T>(values: readonly T[]) => T[]
export function unique<T>(values?: readonly T[]) {
  if (values === undefined) {
    return internalUnique
  }

  return internalUnique(values)
}

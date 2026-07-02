const impl = <T>(values: readonly T[]) => Array.from(new Set(values))

export function unique<T>(values: readonly T[]): T[]
export function unique(): <T>(values: readonly T[]) => T[]
export function unique<T>(values?: readonly T[]) {
  if (values === undefined) {
    return impl
  }

  return impl(values)
}

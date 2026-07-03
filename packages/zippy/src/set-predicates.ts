export function isSubsetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean
export function isSubsetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean
export function isSubsetOf(
  ...args:
    | [values: readonly unknown[], otherValues: readonly unknown[]]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return (values: readonly unknown[]) => isSubsetOf(values, otherValues)
  }

  const [values, otherValues] = args
  const otherSet = new Set(otherValues)

  return values.every((value) => otherSet.has(value))
}

export function isSupersetOf(
  values: readonly unknown[],
  otherValues: readonly unknown[],
): boolean
export function isSupersetOf(
  otherValues: readonly unknown[],
): (values: readonly unknown[]) => boolean
export function isSupersetOf(
  ...args:
    | [values: readonly unknown[], otherValues: readonly unknown[]]
    | [otherValues: readonly unknown[]]
) {
  if (args.length === 1) {
    const [otherValues] = args

    return (values: readonly unknown[]) => isSupersetOf(values, otherValues)
  }

  const [values, otherValues] = args

  return isSubsetOf(otherValues, values)
}

export function isDisjointFrom(
  left: readonly unknown[],
  right: readonly unknown[],
): boolean
export function isDisjointFrom(
  right: readonly unknown[],
): (left: readonly unknown[]) => boolean
export function isDisjointFrom(
  ...args:
    | [left: readonly unknown[], right: readonly unknown[]]
    | [right: readonly unknown[]]
) {
  if (args.length === 1) {
    const [right] = args

    return (left: readonly unknown[]) => isDisjointFrom(left, right)
  }

  const [left, right] = args
  const rightSet = new Set(right)

  return left.every((value) => !rightSet.has(value))
}

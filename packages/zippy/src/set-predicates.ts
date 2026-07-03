import {
  selectValue,
  type PropertyPath,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

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

function selectedKeys<T>(
  values: readonly T[],
  selector: SelectorFunction<T> | string,
) {
  const result = new Set<unknown>()
  let index = 0

  for (const value of values) {
    result.add(selectValue(selector, value, index, values))
    index += 1
  }

  return result
}

function isSubsetOfByValues<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | string,
) {
  const otherKeys = selectedKeys(otherValues, selector)
  let index = 0

  for (const value of values) {
    if (!otherKeys.has(selectValue(selector, value, index, values))) {
      return false
    }

    index += 1
  }

  return true
}

function isSupersetOfByValues<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | string,
) {
  return isSubsetOfByValues(otherValues, values, selector)
}

function isDisjointFromByValues<Left, Right>(
  left: readonly Left[],
  right: readonly Right[],
  selector: SelectorFunction<Left | Right> | string,
) {
  const rightKeys = selectedKeys(right, selector)
  let index = 0

  for (const value of left) {
    if (rightKeys.has(selectValue(selector, value, index, left))) {
      return false
    }

    index += 1
  }

  return true
}

export function isSubsetOfBy<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | PropertyPath<Value | Compared>,
): boolean
export function isSubsetOfBy<Compared>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<Compared> | PropertyPath<Compared>,
): (values: readonly Compared[]) => boolean
export function isSubsetOfBy<const Path extends string, Compared>(
  otherValues: readonly Compared[] & ValidPropertyPath<Compared, Path, unknown>,
  selector: Path,
): (
  values: readonly Compared[] & ValidPropertyPath<Compared, Path, unknown>,
) => boolean
export function isSubsetOfBy<Value, Compared>(
  ...args:
    | [
        values: readonly Value[],
        otherValues: readonly Compared[],
        selector: SelectorFunction<Value | Compared> | string,
      ]
    | [
        otherValues: readonly Compared[],
        selector: SelectorFunction<Compared> | string,
      ]
) {
  if (args.length === 2) {
    const [otherValues, selector] = args

    return (values: readonly Compared[]) =>
      isSubsetOfByValues(values, otherValues, selector)
  }

  const [values, otherValues, selector] = args

  return isSubsetOfByValues(values, otherValues, selector)
}

export function isSupersetOfBy<Value, Compared>(
  values: readonly Value[],
  otherValues: readonly Compared[],
  selector: SelectorFunction<Value | Compared> | PropertyPath<Value | Compared>,
): boolean
export function isSupersetOfBy<Compared>(
  otherValues: readonly Compared[],
  selector: SelectorFunction<Compared> | PropertyPath<Compared>,
): (values: readonly Compared[]) => boolean
export function isSupersetOfBy<const Path extends string, Compared>(
  otherValues: readonly Compared[] & ValidPropertyPath<Compared, Path, unknown>,
  selector: Path,
): (
  values: readonly Compared[] & ValidPropertyPath<Compared, Path, unknown>,
) => boolean
export function isSupersetOfBy<Value, Compared>(
  ...args:
    | [
        values: readonly Value[],
        otherValues: readonly Compared[],
        selector: SelectorFunction<Value | Compared> | string,
      ]
    | [
        otherValues: readonly Compared[],
        selector: SelectorFunction<Compared> | string,
      ]
) {
  if (args.length === 2) {
    const [otherValues, selector] = args

    return (values: readonly Compared[]) =>
      isSupersetOfByValues(values, otherValues, selector)
  }

  const [values, otherValues, selector] = args

  return isSupersetOfByValues(values, otherValues, selector)
}

export function isDisjointFromBy<Left, Right>(
  left: readonly Left[],
  right: readonly Right[],
  selector: SelectorFunction<Left | Right> | PropertyPath<Left | Right>,
): boolean
export function isDisjointFromBy<Right>(
  right: readonly Right[],
  selector: SelectorFunction<Right> | PropertyPath<Right>,
): (left: readonly Right[]) => boolean
export function isDisjointFromBy<const Path extends string, Right>(
  right: readonly Right[] & ValidPropertyPath<Right, Path, unknown>,
  selector: Path,
): (left: readonly Right[] & ValidPropertyPath<Right, Path, unknown>) => boolean
export function isDisjointFromBy<Left, Right>(
  ...args:
    | [
        left: readonly Left[],
        right: readonly Right[],
        selector: SelectorFunction<Left | Right> | string,
      ]
    | [right: readonly Right[], selector: SelectorFunction<Right> | string]
) {
  if (args.length === 2) {
    const [right, selector] = args

    return (left: readonly Right[]) =>
      isDisjointFromByValues(left, right, selector)
  }

  const [left, right, selector] = args

  return isDisjointFromByValues(left, right, selector)
}

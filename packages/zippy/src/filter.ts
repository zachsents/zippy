import { isNullish, isTruthy, isUndefined, type Falsy } from "./guards"

type FilterGuard<T, Narrowed extends T> = (
  value: T,
  index: number,
  values: readonly T[],
) => value is Narrowed

type FilterPredicate<T> = (
  value: T,
  index: number,
  values: readonly T[],
) => unknown

type FilteredByGuard<Value, Narrowed> = Narrowed extends Value
  ? Narrowed
  : Extract<Value, Narrowed>

function isNonNullish<T>(value: T): value is NonNullable<T> {
  return !isNullish(value)
}

function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return !isUndefined(value)
}

export function filter<T, Narrowed extends T>(
  values: readonly T[],
  predicate: FilterGuard<T, Narrowed>,
): Narrowed[]
export function filter<T>(
  values: readonly T[],
  predicate: FilterPredicate<T>,
): T[]
export function filter<T, Narrowed extends T>(
  predicate: FilterGuard<T, Narrowed>,
): <Value extends T>(
  values: readonly Value[],
) => Array<FilteredByGuard<Value, Narrowed>>
export function filter<T>(
  predicate: FilterPredicate<T>,
): <Value extends T>(values: readonly Value[]) => Value[]
export function filter<T>(
  ...args:
    | [values: readonly T[], predicate: FilterPredicate<T>]
    | [predicate: FilterPredicate<T>]
) {
  if (args.length === 1) {
    const [predicate] = args

    return <Value extends T>(values: readonly Value[]) =>
      values.filter((value, index) => predicate(value, index, values))
  }

  const [values, predicate] = args

  return values.filter((value, index) => predicate(value, index, values))
}

export function filterOut<T, Narrowed extends T>(
  values: readonly T[],
  predicate: FilterGuard<T, Narrowed>,
): Array<Exclude<T, Narrowed>>
export function filterOut<T>(
  values: readonly T[],
  predicate: FilterPredicate<T>,
): T[]
export function filterOut<T, Narrowed extends T>(
  predicate: FilterGuard<T, Narrowed>,
): <Value extends T>(
  values: readonly Value[],
) => Array<Exclude<Value, Narrowed>>
export function filterOut<T>(
  predicate: FilterPredicate<T>,
): <Value extends T>(values: readonly Value[]) => Value[]
export function filterOut<T>(
  ...args:
    | [values: readonly T[], predicate: FilterPredicate<T>]
    | [predicate: FilterPredicate<T>]
) {
  if (args.length === 1) {
    const [predicate] = args

    return <Value extends T>(values: readonly Value[]) =>
      values.filter((value, index) => !predicate(value, index, values))
  }

  const [values, predicate] = args

  return values.filter((value, index) => !predicate(value, index, values))
}

export function filterOutFalsy<T>(
  values: readonly T[],
): Array<Exclude<T, Falsy>>
export function filterOutFalsy(): <T>(
  values: readonly T[],
) => Array<Exclude<T, Falsy>>
export function filterOutFalsy<T>(values?: readonly T[]) {
  if (values === undefined) {
    return <Value>(values: readonly Value[]) => values.filter(isTruthy)
  }

  return values.filter(isTruthy)
}

export function filterOutNullish<T>(values: readonly T[]): NonNullable<T>[]
export function filterOutNullish(): <T>(
  values: readonly T[],
) => NonNullable<T>[]
export function filterOutNullish<T>(values?: readonly T[]) {
  if (values === undefined) {
    return <Value>(values: readonly Value[]) => values.filter(isNonNullish)
  }

  return values.filter(isNonNullish)
}

export function filterOutUndefined<T>(
  values: readonly T[],
): Array<Exclude<T, undefined>>
export function filterOutUndefined(): <T>(
  values: readonly T[],
) => Array<Exclude<T, undefined>>
export function filterOutUndefined<T>(values?: readonly T[]) {
  if (values === undefined) {
    return <Value>(values: readonly Value[]) => values.filter(isDefined)
  }

  return values.filter(isDefined)
}

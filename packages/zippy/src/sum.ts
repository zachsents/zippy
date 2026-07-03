import {
  selectNumber,
  type PropertyPathByValue,
  type SelectorFunction,
  type ValidPropertyPath,
} from "./selector"

function impl<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | string = Number,
) {
  let result = 0
  let index = 0

  for (const value of values) {
    result += selectNumber(mapper, value, index, values)
    index += 1
  }

  return result
}

export function sum(values: readonly number[]): number
export function sum(): (values: readonly number[]) => number
export function sum(values?: readonly number[]) {
  if (values === undefined) {
    return (values: readonly number[]) => impl(values)
  }

  return impl(values)
}

export function sumBy<T>(
  values: readonly T[],
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): number
export function sumBy<T>(
  mapper: SelectorFunction<T, number> | PropertyPathByValue<T, number>,
): (values: readonly T[]) => number
export function sumBy<const Path extends string>(
  mapper: Path,
): <T>(values: readonly T[] & ValidPropertyPath<T, Path, number>) => number
export function sumBy<T>(
  ...args:
    | [values: readonly T[], mapper: SelectorFunction<T, number> | string]
    | [mapper: SelectorFunction<T, number> | string]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) => impl(values, mapper)
  }

  const [values, mapper] = args

  return impl(values, mapper)
}

import type { Merge, MergeDeep } from "type-fest"

import { isPlainObject } from "./guards"

function mergeValues<Destination extends object, Source extends object>(
  destination: Destination,
  source: Source,
): Merge<Destination, Source> {
  // @ts-expect-error TypeScript models Object.assign as an intersection, but
  // object spread semantics overwrite destination keys with source keys.
  return Object.assign({}, destination, source)
}

function deepMergeValues<Destination extends object, Source extends object>(
  destination: Destination,
  source: Source,
): MergeDeep<Destination, Source> {
  const result = Object.assign({}, destination) as Partial<
    Record<PropertyKey, unknown>
  >
  const sourceRecord = source as Partial<Record<PropertyKey, unknown>>
  const destinationRecord = destination as Partial<Record<PropertyKey, unknown>>

  for (const key of Reflect.ownKeys(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
      continue
    }

    const destinationValue = destinationRecord[key]
    const sourceValue = sourceRecord[key]

    result[key] =
      isPlainObject(destinationValue) && isPlainObject(sourceValue)
        ? deepMergeValues(destinationValue, sourceValue)
        : sourceValue
  }

  // @ts-expect-error The loop mirrors MergeDeep's plain-object recursion, but
  // TypeScript cannot prove the dynamic key assignments produce that type.
  return result
}

export function merge<Destination extends object, Source extends object>(
  destination: Destination,
  source: Source,
): Merge<Destination, Source>
export function merge<Source extends object>(
  source: Source,
): <Destination extends object>(
  destination: Destination,
) => Merge<Destination, Source>
export function merge<Destination extends object, Source extends object>(
  ...args: [destination: Destination, source: Source] | [source: Source]
) {
  if (args.length === 1) {
    const [source] = args

    return (destination: Destination) => mergeValues(destination, source)
  }

  const [destination, source] = args

  return mergeValues(destination, source)
}

export function deepMerge<Destination extends object, Source extends object>(
  destination: Destination,
  source: Source,
): MergeDeep<Destination, Source>
export function deepMerge<Source extends object>(
  source: Source,
): <Destination extends object>(
  destination: Destination,
) => MergeDeep<Destination, Source>
export function deepMerge<Destination extends object, Source extends object>(
  ...args: [destination: Destination, source: Source] | [source: Source]
) {
  if (args.length === 1) {
    const [source] = args

    return (destination: Destination) => deepMergeValues(destination, source)
  }

  const [destination, source] = args

  return deepMergeValues(destination, source)
}

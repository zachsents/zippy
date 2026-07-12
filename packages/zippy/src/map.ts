import type { Get, Promisable } from "type-fest"

import { isReadonlyArray } from "./is-readonly-array"
import {
  getPropertyPathValue,
  selectValue,
  type PathSatisfier,
  type SelectorPath,
  type SelectorFunction,
  type Selector,
} from "./selector"

type Dictionary<T> = Readonly<Record<string, T>>

type AsyncArrayMapper<T = unknown, Mapped = unknown> = (
  value: T,
  index: number,
  values: readonly T[],
) => Promisable<Mapped>

type MapAsyncOptions = {
  concurrency?: number
}

type DictionaryMapper<Value = unknown, Mapped = unknown> = (
  value: Value,
  key: string,
  values: Dictionary<Value>,
) => Mapped

type AsyncDictionaryMapper<Value = unknown, Mapped = unknown> = (
  value: Value,
  key: string,
  values: Dictionary<Value>,
) => Promisable<Mapped>

type EntryMapper<
  Value = unknown,
  MappedKey extends PropertyKey = PropertyKey,
  MappedValue = unknown,
> = (
  entry: readonly [key: string, value: Value],
  index: number,
  values: Dictionary<Value>,
) => readonly [key: MappedKey, value: MappedValue]

type AsyncEntryMapper<
  Value = unknown,
  MappedKey extends PropertyKey = PropertyKey,
  MappedValue = unknown,
> = (
  entry: readonly [key: string, value: Value],
  index: number,
  values: Dictionary<Value>,
) => Promisable<readonly [key: MappedKey, value: MappedValue]>

type RuntimeArrayMapper = AsyncArrayMapper | string
type RuntimeDictionaryMapper<Mapped = unknown> =
  | AsyncDictionaryMapper<unknown, Mapped>
  | string
type RuntimeEntryMapper = AsyncEntryMapper

type MapAsyncArgs =
  | [mapper: RuntimeArrayMapper, options?: MapAsyncOptions]
  | [
      values: readonly unknown[],
      mapper: RuntimeArrayMapper,
      options?: MapAsyncOptions,
    ]

type MapDictionaryAsyncArgs<Mapped = unknown> =
  | [mapper: RuntimeDictionaryMapper<Mapped>, options?: MapAsyncOptions]
  | [
      values: Dictionary<unknown>,
      mapper: RuntimeDictionaryMapper<Mapped>,
      options?: MapAsyncOptions,
    ]

type MapEntriesAsyncArgs =
  | [mapper: RuntimeEntryMapper, options?: MapAsyncOptions]
  | [
      values: Dictionary<unknown>,
      mapper: RuntimeEntryMapper,
      options?: MapAsyncOptions,
    ]

function isMapAsyncDataFirstArgs(
  args: MapAsyncArgs,
): args is [
  values: readonly unknown[],
  mapper: RuntimeArrayMapper,
  options?: MapAsyncOptions,
] {
  return isReadonlyArray(args[0])
}

function isDictionaryAsyncDataFirstArgs<Mapped>(
  args: MapDictionaryAsyncArgs<Mapped>,
): args is [
  values: Dictionary<unknown>,
  mapper: RuntimeDictionaryMapper<Mapped>,
  options?: MapAsyncOptions,
] {
  return typeof args[0] !== "function" && typeof args[0] !== "string"
}

function isEntriesAsyncDataFirstArgs(
  args: MapEntriesAsyncArgs,
): args is [
  values: Dictionary<unknown>,
  mapper: RuntimeEntryMapper,
  options?: MapAsyncOptions,
] {
  return typeof args[0] !== "function"
}

async function mapAsyncItems<Item, Mapped>(
  items: readonly Item[],
  mapper: (item: Item, index: number) => Promisable<Mapped>,
  options?: MapAsyncOptions,
) {
  const { concurrency } = options ?? {}

  if (
    concurrency !== undefined &&
    (!Number.isInteger(concurrency) || concurrency < 1)
  ) {
    throw new RangeError("mapAsync concurrency must be a positive integer")
  }

  if (concurrency === undefined || concurrency >= items.length) {
    return Promise.all(items.map((item, index) => mapper(item, index)))
  }

  const entries = items.entries()
  const result: Array<Awaited<Mapped>> = []
  let rejected = false

  async function worker() {
    for (;;) {
      if (rejected) {
        return
      }

      const next = entries.next()

      if (next.done) {
        return
      }

      const [index, value] = next.value

      result[index] = await mapper(value, index)
    }
  }

  return Promise.all(
    Array.from({ length: concurrency }, () =>
      worker().catch((error: unknown) => {
        rejected = true

        throw error
      }),
    ),
  ).then(() => result)
}

export function map<T, Path extends SelectorPath<T>>(
  values: readonly T[],
  selector: Path,
): Get<T, Path>[]
export function map<T, Mapped>(
  values: readonly T[],
  selector: SelectorFunction<T, Mapped>,
): Mapped[]
export function map<Path extends string>(
  mapper: Path,
): <T extends PathSatisfier<Path>>(values: readonly T[]) => Array<Get<T, Path>>
export function map<T, Mapped>(
  mapper: Selector<T, Mapped>,
): (values: readonly T[]) => Mapped[]
export function map(
  ...args:
    | [mapper: SelectorFunction<unknown> | string]
    | [values: readonly unknown[], mapper: SelectorFunction<unknown> | string]
) {
  const mapper = args.length === 1 ? args[0] : args[1]
  const apply = (values: readonly unknown[]) =>
    values.map((value, index) => selectValue(mapper, value, index, values))

  if (args.length === 1) {
    return (values: []) => apply(values)
  }

  return apply(args[0])
}

export function mapAsync<T, Path extends SelectorPath<T>>(
  values: readonly T[],
  mapper: Path,
  options?: MapAsyncOptions,
): Promise<Array<Awaited<Get<T, Path>>>>
export function mapAsync<T, Mapped>(
  values: readonly T[],
  mapper: AsyncArrayMapper<T, Mapped>,
  options?: MapAsyncOptions,
): Promise<Array<Awaited<Mapped>>>
export function mapAsync<Path extends string>(
  mapper: Path,
  options?: MapAsyncOptions,
): <T extends PathSatisfier<Path>>(
  values: readonly T[],
) => Promise<Array<Awaited<Get<T, Path>>>>
export function mapAsync<T, Mapped>(
  mapper: AsyncArrayMapper<T, Mapped> | SelectorPath<T, Awaited<Mapped>>,
  options?: MapAsyncOptions,
): (values: readonly T[]) => Promise<Array<Awaited<Mapped>>>
export function mapAsync(
  ...args: MapAsyncArgs
) {
  if (isMapAsyncDataFirstArgs(args)) {
    const [values, mapper, options] = args

    return mapAsyncItems(
      values,
      (value, index) => selectValue(mapper, value, index, values),
      options,
    )
  }

  const [mapper, options] = args

  return (values: []) =>
    mapAsyncItems(
      values,
      (value, index) => selectValue(mapper, value, index, values),
      options,
    )
}

export function mapValues<Value, Path extends SelectorPath<Value>>(
  values: Dictionary<Value>,
  mapper: Path,
): Record<string, Get<Value, Path>>
export function mapValues<Value, Mapped>(
  values: Dictionary<Value>,
  mapper: DictionaryMapper<Value, Mapped>,
): Record<string, Mapped>
export function mapValues<Path extends string>(
  mapper: Path,
): <Value extends PathSatisfier<Path>>(
  values: Dictionary<Value>,
) => Record<string, Get<Value, Path>>
export function mapValues<Value, Mapped>(
  mapper: DictionaryMapper<Value, Mapped> | SelectorPath<Value, Mapped>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Record<string, Mapped>
export function mapValues(
  ...args:
    | [mapper: DictionaryMapper | string]
    | [values: Dictionary<unknown>, mapper: DictionaryMapper | string]
) {
  const mapper = args.length === 1 ? args[0] : args[1]
  const apply = (values: Dictionary<unknown>) => {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(values)) {
      result[key] =
        typeof mapper === "string"
          ? getPropertyPathValue(value, mapper)
          : mapper(value, key, values)
    }

    return result
  }

  if (args.length === 1) {
    return (values: Dictionary<never>) => apply(values)
  }

  return apply(args[0])
}

export function mapValuesAsync<Value, Path extends SelectorPath<Value>>(
  values: Dictionary<Value>,
  mapper: Path,
  options?: MapAsyncOptions,
): Promise<Record<string, Awaited<Get<Value, Path>>>>
export function mapValuesAsync<Value, Mapped>(
  values: Dictionary<Value>,
  mapper: AsyncDictionaryMapper<Value, Mapped>,
  options?: MapAsyncOptions,
): Promise<Record<string, Awaited<Mapped>>>
export function mapValuesAsync<Path extends string>(
  mapper: Path,
  options?: MapAsyncOptions,
): <Value extends PathSatisfier<Path>>(
  values: Dictionary<Value>,
) => Promise<Record<string, Awaited<Get<Value, Path>>>>
export function mapValuesAsync<Value, Mapped>(
  mapper:
    | AsyncDictionaryMapper<Value, Mapped>
    | SelectorPath<Value, Awaited<Mapped>>,
  options?: MapAsyncOptions,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<string, Awaited<Mapped>>>
export function mapValuesAsync(
  ...args: MapDictionaryAsyncArgs
) {
  const apply = (
    values: Dictionary<unknown>,
    mapper: AsyncDictionaryMapper | string,
    options?: MapAsyncOptions,
  ) =>
    mapAsyncItems(
      Object.entries(values),
      async ([key, value]) =>
        [
          key,
          typeof mapper === "string"
            ? getPropertyPathValue(value, mapper)
            : await mapper(value, key, values),
        ] as const,
      options,
    ).then((mappedEntries) => {
      const result: Record<string, unknown> = {}

      for (const [key, value] of mappedEntries) {
        result[key] = value
      }

      return result
    })

  if (isDictionaryAsyncDataFirstArgs(args)) {
    const [values, mapper, options] = args

    return apply(values, mapper, options)
  }

  const [mapper, options] = args

  return (values: Dictionary<never>) => apply(values, mapper, options)
}

export function mapKeys<Value, Path extends SelectorPath<Value, PropertyKey>>(
  values: Dictionary<Value>,
  mapper: Path,
): Record<Get<Value, Path> & PropertyKey, Value>
export function mapKeys<Value, MappedKey extends PropertyKey>(
  values: Dictionary<Value>,
  mapper: DictionaryMapper<Value, MappedKey>,
): Record<MappedKey, Value>
export function mapKeys<Path extends string>(
  mapper: Path,
): <Value extends PathSatisfier<Path, PropertyKey>>(
  values: Dictionary<Value>,
) => Record<Get<Value, Path> & PropertyKey, Value>
export function mapKeys<Value, MappedKey extends PropertyKey>(
  mapper: DictionaryMapper<Value, MappedKey> | SelectorPath<Value, MappedKey>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Record<MappedKey, InputValue>
export function mapKeys(
  ...args:
    | [mapper: DictionaryMapper<unknown, PropertyKey> | string]
    | [
        values: Dictionary<unknown>,
        mapper: DictionaryMapper<unknown, PropertyKey> | string,
      ]
) {
  const mapper = args.length === 1 ? args[0] : args[1]
  const apply = (values: Dictionary<unknown>) => {
    const result: Record<PropertyKey, unknown> = Object.create(null)

    for (const [key, value] of Object.entries(values)) {
      const mappedKey =
        typeof mapper === "string"
          ? getPropertyPathValue(value, mapper)
          : mapper(value, key, values)

      result[
        typeof mappedKey === "string" ||
        typeof mappedKey === "number" ||
        typeof mappedKey === "symbol"
          ? mappedKey
          : String(mappedKey)
      ] = value
    }

    return result
  }

  if (args.length === 1) {
    return (values: Dictionary<never>) => apply(values)
  }

  return apply(args[0])
}

export function mapKeysAsync<
  Value,
  Path extends SelectorPath<Value, PropertyKey>,
>(
  values: Dictionary<Value>,
  mapper: Path,
  options?: MapAsyncOptions,
): Promise<Record<Get<Value, Path> & PropertyKey, Value>>
export function mapKeysAsync<Value, MappedKey extends PropertyKey>(
  values: Dictionary<Value>,
  mapper: AsyncDictionaryMapper<Value, MappedKey>,
  options?: MapAsyncOptions,
): Promise<Record<MappedKey, Value>>
export function mapKeysAsync<Path extends string>(
  mapper: Path,
  options?: MapAsyncOptions,
): <Value extends PathSatisfier<Path, PropertyKey>>(
  values: Dictionary<Value>,
) => Promise<Record<Awaited<Get<Value, Path>> & PropertyKey, Value>>
export function mapKeysAsync<Value, MappedKey extends PropertyKey>(
  mapper:
    | AsyncDictionaryMapper<Value, MappedKey>
    | SelectorPath<Value, MappedKey>,
  options?: MapAsyncOptions,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<MappedKey, InputValue>>
export function mapKeysAsync(
  ...args: MapDictionaryAsyncArgs<PropertyKey>
) {
  const apply = (
    values: Dictionary<unknown>,
    mapper: AsyncDictionaryMapper<unknown, PropertyKey> | string,
    options?: MapAsyncOptions,
  ) =>
    mapAsyncItems(
      Object.entries(values),
      async ([key, value]) => {
        const mappedKey =
          typeof mapper === "string"
            ? getPropertyPathValue(value, mapper)
            : await mapper(value, key, values)

        return [
          typeof mappedKey === "string" ||
          typeof mappedKey === "number" ||
          typeof mappedKey === "symbol"
            ? mappedKey
            : String(mappedKey),
          value,
        ] as const
      },
      options,
    ).then((mappedEntries) => {
      const result: Record<PropertyKey, unknown> = Object.create(null)

      for (const [key, value] of mappedEntries) {
        result[key] = value
      }

      return result
    })

  if (isDictionaryAsyncDataFirstArgs(args)) {
    const [values, mapper, options] = args

    return apply(values, mapper, options)
  }

  const [mapper, options] = args

  return (values: Dictionary<never>) => apply(values, mapper, options)
}

export function mapEntries<Value, MappedKey extends PropertyKey, MappedValue>(
  values: Dictionary<Value>,
  mapper: EntryMapper<Value, MappedKey, MappedValue>,
): Record<MappedKey, MappedValue>
export function mapEntries<Value, MappedKey extends PropertyKey, MappedValue>(
  mapper: EntryMapper<Value, MappedKey, MappedValue>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Record<MappedKey, MappedValue>
export function mapEntries(
  ...args:
    | [mapper: EntryMapper]
    | [values: Dictionary<unknown>, mapper: EntryMapper]
) {
  const mapper = args.length === 1 ? args[0] : args[1]
  const apply = (values: Dictionary<unknown>) => {
    const result: Record<PropertyKey, unknown> = Object.create(null)
    const entries = Object.entries(values)

    for (const [index, entry] of entries.entries()) {
      const [key, value] = mapper(entry, index, values)

      result[key] = value
    }

    return result
  }

  if (args.length === 1) {
    return (values: Dictionary<never>) => apply(values)
  }

  return apply(args[0])
}

export function mapEntriesAsync<
  Value,
  MappedKey extends PropertyKey,
  MappedValue,
>(
  values: Dictionary<Value>,
  mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>,
  options?: MapAsyncOptions,
): Promise<Record<MappedKey, MappedValue>>
export function mapEntriesAsync<
  Value,
  MappedKey extends PropertyKey,
  MappedValue,
>(
  mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>,
  options?: MapAsyncOptions,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<MappedKey, MappedValue>>
export function mapEntriesAsync(
  ...args: MapEntriesAsyncArgs
) {
  const apply = (
    values: Dictionary<unknown>,
    mapper: AsyncEntryMapper,
    options?: MapAsyncOptions,
  ) =>
    mapAsyncItems(
      Object.entries(values),
      (entry, index) => mapper(entry, index, values),
      options,
    ).then((mappedEntries) => {
      const result: Record<PropertyKey, unknown> = Object.create(null)

      for (const [key, value] of mappedEntries) {
        result[key] = value
      }

      return result
    })

  if (isEntriesAsyncDataFirstArgs(args)) {
    const [values, mapper, options] = args

    return apply(values, mapper, options)
  }

  const [mapper, options] = args

  return (values: Dictionary<never>) => apply(values, mapper, options)
}

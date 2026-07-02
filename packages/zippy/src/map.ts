import type { Promisable } from "type-fest"

type Dictionary<T> = Readonly<Record<string, T>>

type ArrayMapper<T, Mapped> = (
  value: T,
  index: number,
  values: readonly T[],
) => Mapped

type AsyncArrayMapper<T, Mapped> = (
  value: T,
  index: number,
  values: readonly T[],
) => Promisable<Mapped>

type DictionaryMapper<Value, Mapped> = (
  value: Value,
  key: string,
  values: Dictionary<Value>,
) => Mapped

type AsyncDictionaryMapper<Value, Mapped> = (
  value: Value,
  key: string,
  values: Dictionary<Value>,
) => Promisable<Mapped>

type EntryMapper<Value, MappedKey extends PropertyKey, MappedValue> = (
  entry: readonly [key: string, value: Value],
  index: number,
  values: Dictionary<Value>,
) => readonly [key: MappedKey, value: MappedValue]

type AsyncEntryMapper<Value, MappedKey extends PropertyKey, MappedValue> = (
  entry: readonly [key: string, value: Value],
  index: number,
  values: Dictionary<Value>,
) => Promisable<readonly [key: MappedKey, value: MappedValue]>

export function map<T, Mapped>(
  values: readonly T[],
  mapper: ArrayMapper<T, Mapped>,
): Mapped[]
export function map<T, Mapped>(
  mapper: ArrayMapper<T, Mapped>,
): (values: readonly T[]) => Mapped[]
export function map<T, Mapped>(
  ...args:
    | [values: readonly T[], mapper: ArrayMapper<T, Mapped>]
    | [mapper: ArrayMapper<T, Mapped>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) =>
      values.map((value, index) => mapper(value, index, values))
  }

  const [values, mapper] = args

  return values.map(mapper)
}

export function mapAsync<T, Mapped>(
  values: readonly T[],
  mapper: AsyncArrayMapper<T, Mapped>,
): Promise<Array<Awaited<Mapped>>>
export function mapAsync<T, Mapped>(
  mapper: AsyncArrayMapper<T, Mapped>,
): (values: readonly T[]) => Promise<Array<Awaited<Mapped>>>
export function mapAsync<T, Mapped>(
  ...args:
    | [values: readonly T[], mapper: AsyncArrayMapper<T, Mapped>]
    | [mapper: AsyncArrayMapper<T, Mapped>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return (values: readonly T[]) =>
      Promise.all(
        values.map((value, index) =>
          Promise.resolve(mapper(value, index, values)),
        ),
      )
  }

  const [values, mapper] = args

  return Promise.all(
    values.map((value, index) => Promise.resolve(mapper(value, index, values))),
  )
}

export function mapValues<Value, Mapped>(
  values: Dictionary<Value>,
  mapper: DictionaryMapper<Value, Mapped>,
): Record<string, Mapped>
export function mapValues<Value, Mapped>(
  mapper: DictionaryMapper<Value, Mapped>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Record<string, Mapped>
export function mapValues<Value, Mapped>(
  ...args:
    | [values: Dictionary<Value>, mapper: DictionaryMapper<Value, Mapped>]
    | [mapper: DictionaryMapper<Value, Mapped>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapValues(values, mapper)
  }

  const [values, mapper] = args
  const result: Record<string, Mapped> = {}

  for (const [key, value] of Object.entries(values)) {
    result[key] = mapper(value, key, values)
  }

  return result
}

export function mapValuesAsync<Value, Mapped>(
  values: Dictionary<Value>,
  mapper: AsyncDictionaryMapper<Value, Mapped>,
): Promise<Record<string, Awaited<Mapped>>>
export function mapValuesAsync<Value, Mapped>(
  mapper: AsyncDictionaryMapper<Value, Mapped>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<string, Awaited<Mapped>>>
export function mapValuesAsync<Value, Mapped>(
  ...args:
    | [values: Dictionary<Value>, mapper: AsyncDictionaryMapper<Value, Mapped>]
    | [mapper: AsyncDictionaryMapper<Value, Mapped>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapValuesAsync(values, mapper)
  }

  const [values, mapper] = args

  return Promise.all(
    Object.entries(values).map(
      async ([key, value]): Promise<readonly [string, Awaited<Mapped>]> => [
        key,
        await mapper(value, key, values),
      ],
    ),
  ).then((mappedEntries) => {
    const result: Record<string, Awaited<Mapped>> = {}

    for (const [key, value] of mappedEntries) {
      result[key] = value
    }

    return result
  })
}

export function mapKeys<Value, MappedKey extends PropertyKey>(
  values: Dictionary<Value>,
  mapper: DictionaryMapper<Value, MappedKey>,
): Record<MappedKey, Value>
export function mapKeys<Value, MappedKey extends PropertyKey>(
  mapper: DictionaryMapper<Value, MappedKey>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Record<MappedKey, InputValue>
export function mapKeys<Value, MappedKey extends PropertyKey>(
  ...args:
    | [values: Dictionary<Value>, mapper: DictionaryMapper<Value, MappedKey>]
    | [mapper: DictionaryMapper<Value, MappedKey>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapKeys(values, mapper)
  }

  const [values, mapper] = args
  const result: Record<MappedKey, Value> = Object.create(null)

  for (const [key, value] of Object.entries(values)) {
    result[mapper(value, key, values)] = value
  }

  return result
}

export function mapKeysAsync<Value, MappedKey extends PropertyKey>(
  values: Dictionary<Value>,
  mapper: AsyncDictionaryMapper<Value, MappedKey>,
): Promise<Record<MappedKey, Value>>
export function mapKeysAsync<Value, MappedKey extends PropertyKey>(
  mapper: AsyncDictionaryMapper<Value, MappedKey>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<MappedKey, InputValue>>
export function mapKeysAsync<Value, MappedKey extends PropertyKey>(
  ...args:
    | [
        values: Dictionary<Value>,
        mapper: AsyncDictionaryMapper<Value, MappedKey>,
      ]
    | [mapper: AsyncDictionaryMapper<Value, MappedKey>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapKeysAsync(values, mapper)
  }

  const [values, mapper] = args

  return Promise.all(
    Object.entries(values).map(
      async ([key, value]): Promise<readonly [MappedKey, Value]> => [
        await mapper(value, key, values),
        value,
      ],
    ),
  ).then((mappedEntries) => {
    const result: Record<MappedKey, Value> = Object.create(null)

    for (const [key, value] of mappedEntries) {
      result[key] = value
    }

    return result
  })
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
export function mapEntries<Value, MappedKey extends PropertyKey, MappedValue>(
  ...args:
    | [
        values: Dictionary<Value>,
        mapper: EntryMapper<Value, MappedKey, MappedValue>,
      ]
    | [mapper: EntryMapper<Value, MappedKey, MappedValue>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapEntries(values, mapper)
  }

  const [values, mapper] = args
  const result: Record<MappedKey, MappedValue> = Object.create(null)
  const entries = Object.entries(values)

  for (const [index, entry] of entries.entries()) {
    const [key, value] = mapper(entry, index, values)

    result[key] = value
  }

  return result
}

export function mapEntriesAsync<
  Value,
  MappedKey extends PropertyKey,
  MappedValue,
>(
  values: Dictionary<Value>,
  mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>,
): Promise<Record<MappedKey, MappedValue>>
export function mapEntriesAsync<
  Value,
  MappedKey extends PropertyKey,
  MappedValue,
>(
  mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>,
): <InputValue extends Value>(
  values: Dictionary<InputValue>,
) => Promise<Record<MappedKey, MappedValue>>
export function mapEntriesAsync<
  Value,
  MappedKey extends PropertyKey,
  MappedValue,
>(
  ...args:
    | [
        values: Dictionary<Value>,
        mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>,
      ]
    | [mapper: AsyncEntryMapper<Value, MappedKey, MappedValue>]
) {
  if (args.length === 1) {
    const [mapper] = args

    return <InputValue extends Value>(values: Dictionary<InputValue>) =>
      mapEntriesAsync(values, mapper)
  }

  const [values, mapper] = args
  const entries = Object.entries(values)

  return Promise.all(
    entries.map((entry, index) =>
      Promise.resolve(mapper(entry, index, values)),
    ),
  ).then((mappedEntries) => {
    const result: Record<MappedKey, MappedValue> = Object.create(null)

    for (const [key, value] of mappedEntries) {
      result[key] = value
    }

    return result
  })
}

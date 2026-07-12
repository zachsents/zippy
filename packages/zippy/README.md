# @zachsents/zippy

Small TypeScript utility functions for arrays, objects, guards, math, sets, and
zipping values.

Most collection helpers can be called data-first or data-last for piping. The
examples below use the data-first form. Helpers that accept selectors take a
callback or a type-safe property/dot path on the base helper name, such as
`sum(values, "count")` or `sum("count")(values)`.

## Functions

### Arrays

- `castArray` - Keep arrays as-is, return an empty array for `undefined`,
  otherwise wrap a value in an array.
- `filter` - Filter an array with a predicate or type guard. Like
  `values.filter(predicate)`.
- `filterOut` - Remove values that match a predicate or type guard. Like
  `values.filter((value, index) => !predicate(value, index, values))`.
- `filterOutFalsy` - Remove falsy values. Like `values.filter(Boolean)`.
- `filterOutNullish` - Remove `null` and `undefined`. Like
  `values.filter((value) => value != null)`.
- `filterOutUndefined` - Remove `undefined`. Like
  `values.filter((value) => value !== undefined)`.
- `map` - Map array values. Like `values.map(mapper)`.
- `mapAsync` - Map array values with async support. Like
  `Promise.all(values.map(mapper))`, or pass `{ concurrency }` to limit parallel
  mapper calls.
- `unique` - Remove duplicate values, optionally by a selected key. Like
  `[...new Set(values)]`.

### Math

- `mean` - Return the arithmetic average of numbers, or numbers selected from
  each value. Returns `undefined` for an empty array.
- `median` - Return the median of numbers, or numbers selected from each value.
  Returns `undefined` for an empty array.
- `mode` - Return the most common value, or the first value whose selected key
  is most common. Returns `undefined` for an empty array.
- `sum` - Add numbers, or numbers selected from each value. Returns `0` for an
  empty array.

### Objects

- `deepMerge` - Recursively merge plain object values, with source values
  overriding destination values.
- `mapEntries` - Transform object entries into a new object. Like
  `Object.fromEntries(Object.entries(values).map((entry, index) => mapper(entry, index, values)))`.
- `mapEntriesAsync` - Transform object entries with async support. Like
  `Object.fromEntries(await Promise.all(Object.entries(values).map((entry, index) => mapper(entry, index, values))))`,
  or pass `{ concurrency }` to limit parallel mapper calls.
- `mapKeys` - Transform object keys. Like
  `Object.fromEntries(Object.entries(values).map(([key, value]) => [mapper(value, key, values), value]))`.
- `mapKeysAsync` - Transform object keys with async support. Like `mapKeys` with
  awaited keys, or pass `{ concurrency }` to limit parallel mapper calls.
- `mapValues` - Transform object values. Like
  `Object.fromEntries(Object.entries(values).map(([key, value]) => [key, mapper(value, key, values)]))`.
- `mapValuesAsync` - Transform object values with async support. Like
  `mapValues` with awaited values, or pass `{ concurrency }` to limit parallel
  mapper calls.
- `merge` - Shallow merge two objects. Like `{ ...destination, ...source }`.

### Matching and Zipping

- `match` - Pair values by matching each left value with the first unmatched
  right value using a required matcher callback or shared property path. Pass a
  merger callback as the fourth argument to map each matched pair.
- `matchMerge` - Match arrays of objects with a required matcher and shallow
  merge each matched pair.
- `zip` - Pair values from two arrays by index. Like
  `left.slice(0, right.length).map((value, index) => [value, right[index]])`.
  Pass a merger callback as the third argument to map each positional pair.

### Guards

- `isFalsy` - Check whether a value is falsy. Like `!value`.
- `isNull` - Check whether a value is `null`. Like `value === null`.
- `isNullish` - Check whether a value is `null` or `undefined`. Like
  `value == null`.
- `isPlainObject` - Check whether a value is a plain object.
- `isTruthy` - Check whether a value is truthy. Like `Boolean(value)`.
- `isUndefined` - Check whether a value is `undefined`. Like
  `value === undefined`.

### Other

- `identity` - Return the input value unchanged. Like `(value) => value`.
- `tuple` - Return arguments as a tuple. Like `(...values) => values`.

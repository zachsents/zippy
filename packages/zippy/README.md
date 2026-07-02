# @zachsents/zippy

Small TypeScript utility functions for arrays, objects, guards, sets, and
zipping values.

Most collection helpers can be called data-first or data-last for piping. The
examples below use the data-first form.

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
  `Promise.all(values.map(mapper))`.
- `unique` - Remove duplicate values. Like `[...new Set(values)]`.

### Objects

- `mapEntries` - Transform object entries into a new object. Like
  `Object.fromEntries(Object.entries(values).map((entry, index) => mapper(entry, index, values)))`.
- `mapEntriesAsync` - Transform object entries with async support. Like
  `Object.fromEntries(await Promise.all(Object.entries(values).map((entry, index) => mapper(entry, index, values))))`.
- `mapKeys` - Transform object keys. Like
  `Object.fromEntries(Object.entries(values).map(([key, value]) => [mapper(value, key, values), value]))`.
- `mapKeysAsync` - Transform object keys with async support. Like `mapKeys`
  with awaited keys.
- `mapValues` - Transform object values. Like
  `Object.fromEntries(Object.entries(values).map(([key, value]) => [key, mapper(value, key, values)]))`.
- `mapValuesAsync` - Transform object values with async support. Like
  `mapValues` with awaited values.

### Sets

- `difference` - Return unique values missing from other arrays. Like
  `[...new Set(values)].filter((value) => !excludedValues.includes(value))`.
- `intersection` - Return unique values shared by all arrays. Like
  `[...new Set(values)].filter((value) => otherArrays.every((array) => array.includes(value)))`.
- `isDisjointFrom` - Check whether two arrays have no shared values. Like
  `values.every((value) => !right.includes(value))`.
- `isSubsetOf` - Check whether every value exists in another array. Like
  `values.every((value) => otherValues.includes(value))`.
- `isSupersetOf` - Check whether another array is a subset of this one. Like
  `otherValues.every((value) => values.includes(value))`.
- `symmetricDifference` - Return unique values that appear in only one array.
  Like `difference(left, right)` plus `difference(right, left)`.
- `union` - Return unique values across arrays. Like
  `[...new Set([...values, ...otherValues])]`.

### Zipping

- `zip` - Pair values from two arrays by index. Like
  `left.slice(0, right.length).map((value, index) => [value, right[index]])`.
- `zipCustom` - Pair values with custom matching and optional merging.
- `zipWith` - Pair and map values from two arrays by index. Like `zip` plus a
  mapper.

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

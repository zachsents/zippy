# @zachsents/zippy

Small TypeScript utility functions for arrays, objects, guards, math, sets, and
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
- `uniqueBy` - Remove duplicate values by a mapped key or type-safe
  property/dot path selector.

### Math

The `*By` math helpers accept a mapper function or a type-safe property/dot
path selector.

- `mean` - Return the arithmetic average of numbers, or `undefined` for an
  empty array.
- `meanBy` - Return the arithmetic average of mapped numbers, or `undefined`
  for an empty array.
- `median` - Return the median of numbers, or `undefined` for an empty array.
- `medianBy` - Return the median of mapped numbers, or `undefined` for an empty
  array.
- `mode` - Return the most common value, or `undefined` for an empty array.
- `modeBy` - Return the first value whose mapped key is most common, or
  `undefined` for an empty array.
- `sum` - Add numbers. Returns `0` for an empty array.
- `sumBy` - Add mapped numbers. Returns `0` for an empty array.

### Objects

- `deepMerge` - Recursively merge plain object values, with source values
  overriding destination values.
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
- `merge` - Shallow merge two objects. Like `{ ...destination, ...source }`.

### Sets

The `*By` set helpers accept a mapper function or a type-safe property/dot path
selector.

- `difference` - Return unique values missing from other arrays. Like
  `[...new Set(values)].filter((value) => !excludedValues.includes(value))`.
- `differenceBy` - Return unique values missing by mapped key.
- `intersection` - Return unique values shared by all arrays. Like
  `[...new Set(values)].filter((value) => otherArrays.every((array) => array.includes(value)))`.
- `intersectionBy` - Return unique values shared by mapped key.
- `isDisjointFrom` - Check whether two arrays have no shared values. Like
  `values.every((value) => !right.includes(value))`.
- `isDisjointFromBy` - Check whether two arrays have no shared mapped keys.
- `isSubsetOf` - Check whether every value exists in another array. Like
  `values.every((value) => otherValues.includes(value))`.
- `isSubsetOfBy` - Check whether every mapped key exists in another array.
- `isSupersetOf` - Check whether another array is a subset of this one. Like
  `otherValues.every((value) => values.includes(value))`.
- `isSupersetOfBy` - Check whether another array's mapped keys are a subset of
  this one.
- `symmetricDifference` - Return unique values that appear in only one array.
  Like `difference(left, right)` plus `difference(right, left)`.
- `symmetricDifferenceBy` - Return unique values whose mapped key appears in
  only one array.
- `union` - Return unique values across arrays. Like
  `[...new Set([...values, ...otherValues])]`.
- `unionBy` - Return unique values across arrays by mapped key.

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

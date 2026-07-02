# @zachsents/zippy

Small TypeScript utility functions for arrays, objects, guards, sets, and
zipping values.

Most collection helpers can be called data-first or data-last for piping.

## Functions

### Arrays

- `castArray` - Keep arrays as-is, otherwise wrap a value in an array.
- `filter` - Filter an array with a predicate or type guard.
- `filterOut` - Remove values that match a predicate or type guard.
- `filterOutFalsy` - Remove falsy values.
- `filterOutNullish` - Remove `null` and `undefined`.
- `filterOutUndefined` - Remove `undefined`.
- `map` - Map array values.
- `mapAsync` - Map array values with async support.
- `unique` - Remove duplicate values.

### Objects

- `mapEntries` - Transform object entries into a new object.
- `mapEntriesAsync` - Transform object entries with async support.
- `mapKeys` - Transform object keys.
- `mapKeysAsync` - Transform object keys with async support.
- `mapValues` - Transform object values.
- `mapValuesAsync` - Transform object values with async support.

### Sets

- `difference` - Return unique values missing from other arrays.
- `intersection` - Return unique values shared by all arrays.
- `isDisjointFrom` - Check whether two arrays have no shared values.
- `isSubsetOf` - Check whether every value exists in another array.
- `isSupersetOf` - Check whether another array is a subset of this one.
- `symmetricDifference` - Return unique values that appear in only one array.
- `union` - Return unique values across arrays.

### Zipping

- `zip` - Pair values from two arrays by index.
- `zipCustom` - Pair values with custom matching and optional merging.
- `zipWith` - Pair and map values from two arrays by index.

### Guards

- `isFalsy` - Check whether a value is falsy.
- `isNull` - Check whether a value is `null`.
- `isNullish` - Check whether a value is `null` or `undefined`.
- `isPlainObject` - Check whether a value is a plain object.
- `isTruthy` - Check whether a value is truthy.
- `isUndefined` - Check whether a value is `undefined`.

### Other

- `identity` - Return the input value unchanged.

// This file is typechecked only and will never actually run.
import type { IsEqual } from "type-fest"
import type {
  PropertyPath,
  PropertyPathByValue,
  PropertyPathValue,
  ValidPropertyPath,
  ValueSelector,
} from "./selector"

type Metric = {
  readonly count: number
  readonly label: string
  readonly stats: {
    readonly score: number
    readonly name: string
    readonly optionalScore?: number
  }
  readonly optionalStats?: {
    readonly score: number
  }
}

const rootPath = "count" satisfies PropertyPath<Metric>
const dotPath = "stats.score" satisfies PropertyPath<Metric>
const numberRootPath = "count" satisfies PropertyPathByValue<Metric, number>
const numberDotPath = "stats.score" satisfies PropertyPathByValue<
  Metric,
  number
>
const functionSelector = ((value: Metric) =>
  value.count) satisfies ValueSelector<Metric, number>
const pathSelector = "stats.score" satisfies ValueSelector<Metric, number>

true satisfies IsEqual<typeof rootPath, "count">
true satisfies IsEqual<typeof dotPath, "stats.score">
true satisfies IsEqual<typeof numberRootPath, "count">
true satisfies IsEqual<typeof numberDotPath, "stats.score">
true satisfies IsEqual<
  PropertyPathByValue<Metric, number>,
  "count" | "stats.score"
>
true satisfies IsEqual<PropertyPathValue<Metric, "stats.score">, number>
true satisfies IsEqual<typeof functionSelector, (value: Metric) => number>
true satisfies IsEqual<typeof pathSelector, "stats.score">
true satisfies IsEqual<
  ValidPropertyPath<Metric, "stats.score", number>,
  unknown
>
true satisfies IsEqual<ValidPropertyPath<Metric, "stats.name", number>, never>

// @ts-expect-error string paths must exist on the selected value.
"missing" satisfies PropertyPath<Metric>

// @ts-expect-error selected paths must resolve to the requested value type.
"label" satisfies PropertyPathByValue<Metric, number>

// @ts-expect-error optional paths are not valid number selectors.
"stats.optionalScore" satisfies PropertyPathByValue<Metric, number>

// @ts-expect-error optional parent paths are not valid number selectors.
"optionalStats.score" satisfies PropertyPathByValue<Metric, number>

// @ts-expect-error path selectors are value-type checked.
"stats.name" satisfies ValueSelector<Metric, number>

/**
 * Preserves the literal tuple type of the passed values.
 *
 * @param values - The values to process.
 * @returns The values as a tuple.
 */
export function tuple<const Values extends unknown[]>(
  ...values: Values
): Values {
  return values
}

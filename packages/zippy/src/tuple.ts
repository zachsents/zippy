export function tuple<const Values extends unknown[]>(
  ...values: Values
): Values {
  return values
}

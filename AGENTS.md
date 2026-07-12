# Repository Guidelines

## TypeScript

- Do not annotate return types on overloaded function implementation signatures.
  Keep return type annotations on the overload signatures themselves; the
  implementation return annotation is unnecessary and can fight inference.
- Treat overload order as intentional API surface, especially for data-last
  selector helpers. The language server uses overload order plus inference
  details such as `NoInfer<T>` when choosing the active overload, and that
  affects autocomplete even when CLI type tests still pass.
- For selector overload pairs, keep the more authoritative/contextual overload
  before the broader generic fallback. For example,
  `selector: SelectorFunction<NoInfer<T>, number> -> (values: readonly T[]) => number`
  should stay before
  `selector: SelectorFunction<T, number> -> <U extends T>(values: readonly U[]) => number`;
  the first overload improves callback autocomplete from the eventual values
  type, while the second preserves extra properties on later inline values.
- Do not introduce one-use helper functions or type aliases for trivial runtime
  checks, simple union aliases, or direct selector dispatch. Inline those
  expressions unless the helper is reused, represents a real domain invariant,
  or removes meaningful complexity.

## Type tests

- For data-last selector overloads that return a function, test both a named
  values variable and an inline array literal when the selector parameter is
  narrower than the values. A non-generic returned function like
  `(values: readonly T[]) => number` can accept the named variable but reject
  the inline literal through excess-property checking; use a generic returned
  function like `<U extends T>(values: readonly U[]) => number` when later
  values may carry extra properties.
- When checking this behavior, compare the returned function generic against a
  non-generic returned function. Do not test it by deleting the whole selector
  overload if an authoritative `NoInfer<T>` overload remains, because that
  changes overload selection instead of just the returned function's values
  inference.

## Source layout

- Follow the existing flat `packages/zippy/src` file layout before creating or
  moving utilities. Keep related variants in one top-level file, such as `sum`
  with `sumBy` or `filter` with `filterOut`, with matching top-level `.test.ts`
  and `.type-test.ts` files. Do not create nested utility folders, per-function
  barrels, or shared helper files unless the surrounding codebase already uses
  that pattern for the same kind of helper.

## Publishing

- Only publish when the user explicitly asks for it, but when they do, carry the
  publish through from the CLI instead of stopping at instructions. Use the repo
  publish script when available.
- Run publish commands in an interactive terminal/PTY so npm can prompt for
  browser-based auth or 2FA. If npm prints
  `Press ENTER to open in the browser...`, press Enter yourself and leave the
  publish process running while the user completes the browser approval. Do not
  ask the user for an OTP before trying this browser-auth flow.
- If non-interactive publish fails with `EOTP`, retry interactively before
  asking for an OTP. Ask for an OTP only if the interactive browser-auth flow is
  unavailable, fails, or explicitly asks for a code instead of opening browser
  approval.
- After publish reports success, verify the exact version with
  `npm view <package>@<version> version --prefer-online` and verify the `latest`
  dist-tag. `npm view <package> version` can lag or return stale metadata
  immediately after publish, so do not treat that alone as a failed publish.

## Release prep

- When the user says "let's release", "release this", or similar, prepare the
  npm release for CI instead of publishing locally unless they explicitly ask
  for a manual publish.
- Check `git status` first and keep the release commit scoped. The release
  version lives in both `packages/zippy/package.json` and `bun.lock`; stage
  those files plus release-process docs only when intentionally updating them.
- Choose the semver bump from the commits since the latest `vX.Y.Z` tag: patch
  for fixes/docs/internal-only package changes, minor for new public helpers or
  options, and major only for breaking public API changes. Pre-1.0 feature
  releases still use a minor bump unless the user directs otherwise.
- Verify release readiness with `bun run --cwd packages/zippy check`. This
  command can generate build/pack artifacts, so clean up generated files that
  are not meant to be committed before staging.
- Commit the bump with a message like `chore: release zippy X.Y.Z`, then push
  the current `main` branch. The `.github/workflows/npm-release.yml` workflow
  publishes to npm and creates the GitHub release when the pushed package
  version increases.

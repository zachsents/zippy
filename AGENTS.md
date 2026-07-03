# Repository Guidelines

## TypeScript

- Do not annotate return types on overloaded function implementation signatures. Keep return type annotations on the overload signatures themselves; the implementation return annotation is unnecessary and can fight inference.

## Source layout

- Follow the existing flat `packages/zippy/src` file layout before creating or moving utilities. Keep related variants in one top-level file, such as `sum` with `sumBy` or `filter` with `filterOut`, with matching top-level `.test.ts` and `.type-test.ts` files. Do not create nested utility folders, per-function barrels, or shared helper files unless the surrounding codebase already uses that pattern for the same kind of helper.

## Publishing

- Only publish when the user explicitly asks for it, but when they do, carry the publish through from the CLI instead of stopping at instructions. Use the repo publish script when available.
- Run publish commands in an interactive terminal/PTY so npm can prompt for browser-based auth or 2FA. If npm prints `Press ENTER to open in the browser...`, press Enter yourself and leave the publish process running while the user completes the browser approval. Do not ask the user for an OTP before trying this browser-auth flow.
- If non-interactive publish fails with `EOTP`, retry interactively before asking for an OTP. Ask for an OTP only if the interactive browser-auth flow is unavailable, fails, or explicitly asks for a code instead of opening browser approval.
- After publish reports success, verify the exact version with `npm view <package>@<version> version --prefer-online` and verify the `latest` dist-tag. `npm view <package> version` can lag or return stale metadata immediately after publish, so do not treat that alone as a failed publish.

## Release prep

- When the user says "let's release", "release this", or similar, prepare the npm release for CI instead of publishing locally unless they explicitly ask for a manual publish.
- Check `git status` first and keep the release commit scoped. The release version lives in both `packages/zippy/package.json` and `bun.lock`; stage those files plus release-process docs only when intentionally updating them.
- Choose the semver bump from the commits since the latest `vX.Y.Z` tag: patch for fixes/docs/internal-only package changes, minor for new public helpers or options, and major only for breaking public API changes. Pre-1.0 feature releases still use a minor bump unless the user directs otherwise.
- Verify release readiness with `bun run --cwd packages/zippy check`. This command can generate build/pack artifacts, so clean up generated files that are not meant to be committed before staging.
- Commit the bump with a message like `chore: release zippy X.Y.Z`, then push the current `main` branch. The `.github/workflows/npm-release.yml` workflow publishes to npm and creates the GitHub release when the pushed package version increases.

# Repository Guidelines

## TypeScript

- Do not annotate return types on overloaded function implementation signatures. Keep return type annotations on the overload signatures themselves; the implementation return annotation is unnecessary and can fight inference.

## Publishing

- Only publish when the user explicitly asks for it, but when they do, carry the publish through from the CLI instead of stopping at instructions. Use the repo publish script when available, let the CLI open browser-based npm auth or 2FA, tell the user to approve it in the browser, then continue the terminal flow until publish succeeds or fails.

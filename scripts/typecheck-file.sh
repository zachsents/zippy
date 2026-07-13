#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: scripts/typecheck-file.sh <packages/zippy file>" >&2
  echo "Examples:" >&2
  echo "  scripts/typecheck-file.sh src/sum.type-test.ts" >&2
  echo "  scripts/typecheck-file.sh packages/zippy/src/sum.type-test.ts" >&2
}

if [ "$#" -ne 1 ]; then
  usage
  exit 2
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
package_dir="$repo_root/packages/zippy"
input_file=$1

case "$input_file" in
  "$package_dir"/*)
    relative_file=${input_file#"$package_dir"/}
    ;;
  packages/zippy/*)
    relative_file=${input_file#packages/zippy/}
    ;;
  ./packages/zippy/*)
    relative_file=${input_file#./packages/zippy/}
    ;;
  ./*)
    relative_file=${input_file#./}
    ;;
  *)
    relative_file=$input_file
    ;;
esac

case "$relative_file" in
  *\"* | *\\*)
    echo "File paths containing double quotes or backslashes are not supported." >&2
    exit 2
    ;;
esac

if [ ! -f "$package_dir/$relative_file" ]; then
  echo "File not found under packages/zippy: $relative_file" >&2
  exit 2
fi

tmp_config=$(mktemp "$package_dir/tsconfig.single.json.XXXXXX")
trap 'rm -f "$tmp_config"' EXIT HUP INT TERM

# Extend the base config directly so packages/zippy/tsconfig.json does not
# pull every src/**/*.ts file into this targeted check.
printf '{"extends":"../../tsconfig.base.json","files":["%s"]}\n' "$relative_file" > "$tmp_config"

cd "$package_dir"

if command -v tsgo >/dev/null 2>&1; then
  tsgo --noEmit -p "$tmp_config"
else
  bunx tsc --noEmit -p "$tmp_config"
fi

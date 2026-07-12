#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: bun run check:fn <helper-name>" >&2
  echo "Example: bun run check:fn sum" >&2
}

if [ "$#" -ne 1 ]; then
  usage
  exit 2
fi

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
package_dir="$repo_root/packages/zippy"
helper_name=$1

cd "$package_dir"

case "$helper_name" in
  src/*)
    helper_name=${helper_name#src/}
    ;;
esac

case "$helper_name" in
  *.type-test.ts)
    helper_name=${helper_name%.type-test.ts}
    ;;
  *.test.ts)
    helper_name=${helper_name%.test.ts}
    ;;
  *.ts)
    helper_name=${helper_name%.ts}
    ;;
esac

case "$helper_name" in
  "" | */* | *\"* | *\\*)
    echo "Invalid helper name: $1" >&2
    exit 2
    ;;
esac

target_files=""
for file in \
  "src/$helper_name.ts" \
  "src/$helper_name.test.ts" \
  "src/$helper_name.type-test.ts"
do
  if [ -f "$file" ]; then
    target_files="${target_files}${target_files:+
}$file"
  fi
done

if [ -z "$target_files" ]; then
  echo "No matching files found for helper: $helper_name" >&2
  exit 2
fi

echo "Target files:"
printf '  %s\n' $target_files

echo
echo "Linting..."
oxlint --type-aware --fix --fix-suggestions $target_files

echo
echo "Formatting..."
prettier --write $target_files

tmp_config=$(mktemp "$package_dir/tsconfig.check-fn.json.XXXXXX")
trap 'rm -f "$tmp_config"' EXIT HUP INT TERM

# Extend the base config directly so packages/zippy/tsconfig.json does not
# pull every src/**/*.ts file into this targeted check.
{
  printf '{"extends":"../../tsconfig.base.json","files":['
  first=1
  for file in $target_files; do
    if [ "$first" -eq 1 ]; then
      first=0
    else
      printf ','
    fi
    printf '"%s"' "$file"
  done
  printf ']}\n'
} > "$tmp_config"

echo
echo "Typechecking..."
if command -v tsgo >/dev/null 2>&1; then
  tsgo --noEmit -p "$tmp_config"
else
  bunx tsc --noEmit -p "$tmp_config"
fi

runtime_test_files=$(printf '%s\n' $target_files | grep '\.test\.ts$' || true)

if [ -z "$runtime_test_files" ]; then
  echo
  echo "No matching runtime test files found; skipping bun test."
  exit 0
fi

echo
echo "Testing..."
bun test $runtime_test_files

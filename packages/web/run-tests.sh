#!/bin/bash
# Run each test file in isolation to prevent module mock leaking between files.
# Bun's test runner shares module cache across files in a single run,
# so we run each file separately with parallelism for speed + isolation.

set -uo pipefail

FAILED_LOG=$(mktemp)
trap "rm -f $FAILED_LOG" EXIT

run_test() {
  if ! bun test "./$1" > /dev/null 2>&1; then
    echo "FAIL: $1" | tee -a "$FAILED_LOG"
  fi
}
export -f run_test
export FAILED_LOG

find src \( -name "*.test.ts" -o -name "*.test.tsx" \) -print0 | sort -z | xargs -0 -P 8 -n 1 bash -c 'run_test "$0"'

total=$(find src \( -name "*.test.ts" -o -name "*.test.tsx" \) | wc -l | tr -d ' ')
failed=$(wc -l < "$FAILED_LOG" | tr -d ' ')

echo ""
echo "Test files: $total total, $failed failed, $((total - failed)) passed"

if [ "$failed" -gt 0 ]; then
  exit 1
fi

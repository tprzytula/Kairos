#!/bin/bash
# Run each test file in isolation to prevent module mock leaking between files.
# Bun's test runner shares module cache across files in a single run,
# so we run each file separately with parallelism for speed + isolation.

set -uo pipefail

FAILED_LOG=$(mktemp)
trap "rm -f $FAILED_LOG" EXIT

find sources libs -name "*.test.ts" | sort | xargs -P 8 -I {} sh -c '
  if ! bun test "{}" > /dev/null 2>&1; then
    echo "FAIL: {}" | tee -a '"$FAILED_LOG"'
  fi
'

total=$(find sources libs -name "*.test.ts" | wc -l | tr -d ' ')
failed=$(wc -l < "$FAILED_LOG" | tr -d ' ')

echo ""
echo "Test files: $total total, $failed failed, $((total - failed)) passed"

if [ "$failed" -gt 0 ]; then
  exit 1
fi

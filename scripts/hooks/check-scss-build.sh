#!/usr/bin/env bash
# After editing a .scss file, runs a fast Hugo build to surface SCSS compilation
# errors immediately rather than waiting for the next `make site` restart.
#
# Informational only — exits 0 regardless so it never blocks an edit.
# Hugo must be installed and on $PATH; silently skips if not found.
#
# Usage as an AI coding assistant hook (PostToolUse):
#   Tool input arrives as JSON on stdin.

set -uo pipefail

if [ -t 0 ]; then
  exit 0
fi

file_path=$(python3 -c "
import sys, json
try:
    print(json.load(sys.stdin).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

[[ "$file_path" != *.scss ]] && exit 0
command -v hugo &>/dev/null || exit 0

result=$(hugo --quiet --renderToMemory 2>&1) || {
  echo "⚠️  SCSS build error after editing $(basename "$file_path"):" >&2
  echo "$result" | tail -15 >&2
}

exit 0

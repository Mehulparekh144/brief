#!/usr/bin/env bash
# Self-check for every challenge: the starting repo fails the full suite
# (public + hidden tests) and the reference solution passes it.
# Usage: bash scripts/check-challenges.sh [slug ...]   (no slug = every challenge)
set -u
export PYTHONDONTWRITEBYTECODE=1 # the solution is copied over the start in the same second; stale .pyc files would hide it
cd "$(dirname "$0")/../challenges" || exit 1
status=0
if [ $# -gt 0 ]; then slugs="$*"; else slugs=$(ls -d */ | tr -d /); fi
for slug in $slugs; do
  [ -f "$slug/challenge.json" ] || continue
  cmd=$(node -p "require('./$slug/challenge.json').testCmd")
  tmp=$(mktemp -d)
  cp -R "$slug/repo/." "$tmp/" && cp -R "$slug/hidden/." "$tmp/"
  if (cd "$tmp" && eval "$cmd" >/dev/null 2>&1); then echo "FAIL $slug: the starting repo already passes"; status=1; fi
  cp -R "$slug/solution/." "$tmp/"
  min=$(node -p "require('./$slug/challenge.json').minTests ?? 0")
  if out=$(cd "$tmp" && eval "$cmd" 2>&1); then
    n=$(printf '%s\n' "$out" | sed -nE 's/^# pass ([0-9]+).*/\1/p; s/^Ran ([0-9]+) tests?.*/\1/p' | tail -1)
    if [ "${n:-0}" -ge "$min" ]; then echo "ok   $slug ($n tests, min $min)"
    else echo "FAIL $slug: solution ran ${n:-0} tests, minTests is $min"; status=1; fi
  else echo "FAIL $slug: the solution does not pass"; printf '%s\n' "$out" | tail -25; status=1; fi
  rm -rf "$tmp"
done
exit $status

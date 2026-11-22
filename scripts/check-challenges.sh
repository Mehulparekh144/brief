#!/usr/bin/env bash
# Self-check for every challenge: the starting repo fails the full suite
# (public + hidden tests) and the reference solution passes it.
set -u
cd "$(dirname "$0")/../challenges" || exit 1
status=0
for dir in */; do
  slug=${dir%/}
  [ -f "$slug/challenge.json" ] || continue
  cmd=$(node -p "require('./$slug/challenge.json').testCmd")
  tmp=$(mktemp -d)
  cp -R "$slug/repo/." "$tmp/" && cp -R "$slug/hidden/." "$tmp/"
  if (cd "$tmp" && eval "$cmd" >/dev/null 2>&1); then echo "FAIL $slug: the starting repo already passes"; status=1; fi
  cp -R "$slug/solution/." "$tmp/"
  if (cd "$tmp" && eval "$cmd" >/dev/null 2>&1); then echo "ok   $slug"
  else echo "FAIL $slug: the solution does not pass"; (cd "$tmp" && eval "$cmd" 2>&1 | tail -25); status=1; fi
  rm -rf "$tmp"
done
exit $status

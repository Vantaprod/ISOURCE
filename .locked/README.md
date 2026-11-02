# 🔒 LOCKED: Bundle Feature v1

**Created:** $(Get-Date)

## Why this folder exists

Per user policy: **after verification, code must be locked** so future auto-generated
scripts don't silently rewrite already-fixed files (avoids the back-and-forth bug cycle).

## What "locked" means

`bundle-feature-v1.json` contains the SHA-256 hash of every critical Bundle-feature
file. Any future script that wants to modify these files MUST:

1. Read `bundle-feature-v1.json`
2. Compare the current file hash
3. If it matches → the fix is already applied → **skip the write**
4. If the user explicitly wants a change → ask for confirmation, then update the manifest

## Locked files

See `bundle-feature-v1.json` → `files[]`.

## How to unlock (only when intentionally changing the feature)

Delete the `.locked` folder OR generate a new manifest version, e.g. `bundle-feature-v2.json`.
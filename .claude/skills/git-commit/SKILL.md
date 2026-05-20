---
name: git-commit
description: Save the user's changes as a Git commit. The user does not know Git terminology — translate every step into plain English.
---

# Saving work (Git commits) for a non-technical user

The user just said something like _"save this"_, _"keep this version"_,
_"I want to remember this state"_. They mean: **make a Git commit**.
They do not know the word "commit", "branch", "stage", or "diff".

## Before you do anything

1. Confirm in plain language: _"I'll save a snapshot of your current
   changes so you can come back to this version later. OK?"_
2. Show what will be saved. Run:
   ```bash
   git status
   ```
   Then describe the output as a bullet list of files in everyday
   language: _"You've changed 3 files: the home page, the button
   component, and the styles."_

## Safety checks

Before committing, verify:

- No `.env`, `.env.local`, `credentials.json`, or files containing
  `KEY=`, `TOKEN=`, `SECRET=` are staged. If any are present, **stop**
  and warn the user — these should never go to GitHub. Add them to
  `.gitignore` instead.
- No huge binary files (> 5 MB). If you see one, ask first.
- The pre-commit hook (husky + lint-staged) will auto-format and
  lint-fix staged files. If it fails, the commit is aborted — read the
  error, fix the underlying issue, and try again. **Never bypass with
  `--no-verify`.**

## The flow

1. **Stage specific files** (don't use `git add -A` blindly):

   ```bash
   git add app/page.tsx components/header.tsx
   ```

   If the user has many small changes that obviously belong together,
   `git add .` is acceptable — but only after the safety checks above.

2. **Write the commit message.** Style: short imperative sentence in
   English, focused on _what changed for the user_, not the
   implementation. Examples:
   - ✅ `Add contact form to homepage`
   - ✅ `Fix dark mode toggle on mobile`
   - ✅ `Update pricing copy`
   - ❌ `wip`
   - ❌ `changes`
   - ❌ `Refactored useEffect dependency array`

3. **Commit using a heredoc** so newlines and quotes don't break:

   ```bash
   git commit -m "$(cat <<'EOF'
   Add contact form to homepage
   EOF
   )"
   ```

4. **Confirm to the user** in plain English: _"Saved. You have 5 saved
   snapshots so far."_ (You can get the count via
   `git rev-list --count HEAD`.)

## What you must NOT do

- ❌ Skip hooks (`--no-verify`, `--no-gpg-sign`).
- ❌ Run `git reset --hard`, `git checkout .`, `git clean -fd`, or any
  command that throws away the user's work without an explicit "yes,
  discard my changes" from them.
- ❌ Amend a previous commit unless the user explicitly says "fix the
  last save". They don't read git history; surprise rewrites confuse
  them.
- ❌ Push to GitHub as part of "save". Saving (commit) and publishing
  (push) are separate concepts — see
  `.claude/skills/github-publish/SKILL.md`.

## If the commit fails

The pre-commit hook caught something (a TypeScript error, an ESLint
error, an unformatted file it couldn't auto-fix). The commit did **not**
happen — the changes are still in place.

1. Read the hook output, find the file and line.
2. Fix the actual problem.
3. Re-stage and commit again (a **new** commit, not `--amend`).

Tell the user, in plain English, what the issue was and that you fixed
it. _"There was a typo in the email validation — I corrected it and
saved."_

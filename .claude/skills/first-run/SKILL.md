---
name: first-run
description: Bootstrap a freshly forked / cloned project. Detect what's missing (Node, deps), install or fix it for the user, and report when the project is ready. Run this proactively on session 1 in a fresh checkout.
---

# First-run bootstrap

The user just forked this repo and opened it in Claude Desktop for the
first time. They didn't ask for "first-run setup" — they probably just
said _"hi"_ or _"let's start"_ or _"add a button"_. Your job is to
silently detect the empty state and **bootstrap everything before
asking them to do anything**.

## Detect

Run all of these at once (they're read-only) and combine the results:

```bash
node --version
npm --version
git --version
test -d node_modules && echo "deps-ok" || echo "deps-missing"
git rev-list --count HEAD 2>/dev/null || echo "no-commits"
```

Based on the output, branch:

| Output                    | Meaning                                   |
| ------------------------- | ----------------------------------------- |
| `node: command not found` | Need to install Node 22 → see below       |
| `v22.x.x` or newer        | Node is fine                              |
| `v18.x.x` / `v20.x.x`     | Old but workable; warn briefly            |
| `deps-missing`            | Need to run `npm install`                 |
| `deps-ok`                 | Skip install                              |
| `git: command not found`  | Need Git (rare on Mac, common on Windows) |
| `no-commits`              | First commit hasn't been made yet         |

## Install Node — try automatic paths first

**You are the operator. Try to install Node yourself before asking the
user to do anything.** Order of attempts on macOS:

### Attempt 1 — Homebrew (if present)

```bash
command -v brew >/dev/null && brew install node@22 && brew link --force node@22
```

If `brew` exists, this is the cleanest path. Report _"Installing Node
22 via Homebrew, ~1 minute…"_ to the user while it runs.

### Attempt 2 — `fnm` one-liner

`fnm` is a small static Node version manager — no Python, no compilers
needed. Install it and then Node in one go:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
# Then in the *same* tool invocation, source it and install Node 22:
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm install 22
fnm use 22
```

This modifies `~/.zshrc` / `~/.bashrc`. Mention this to the user in
plain English: _"I'm installing a small tool called fnm that manages
Node versions. It added one line to your shell config so Node is
always on your PATH."_

### Attempt 3 — Manual GUI installer (only if both above fail or you can't run shell commands)

Walk the user through <https://nodejs.org/en/download> → green LTS
button → run installer → re-open Claude Desktop. See section 1b of
`CLAUDE.md` for the script.

### On Windows

If `node` is missing and `winget` is available, try:

```bash
winget install OpenJS.NodeJS.LTS
```

Otherwise fall back to the GUI installer at
<https://nodejs.org/en/download>.

### After install — re-verify

Always re-check before continuing:

```bash
node --version
```

If it still says `command not found`, the user likely needs to **quit
Claude Desktop and re-open it** so the shell picks up the new PATH.
Tell them in plain English and stop. Resume bootstrap when they're
back.

## Install dependencies

Once Node is confirmed, run:

```bash
npm install
```

Report progress in plain English: _"Installing 250 or so packages,
takes 1–3 minutes…"_. When it finishes, summarize: _"Done. Installed
487 packages with no errors."_

### If `npm install` fails

- **`EACCES` / permissions** → the user has a corrupted `~/.npm` from
  a past `sudo npm install`. You can't `chown` for them. Ask them to
  paste **exactly one line** into their terminal and type their
  password:

  ```bash
  sudo chown -R $(whoami) ~/.npm
  ```

  Then you re-run `npm install`.

- **`ENOSPC` / disk full** → tell them their disk is full and stop.
- **Network errors** → retry once, then ask them to check the
  internet.

## Verify the build works

This catches problems before the user notices them:

```bash
npm run build
```

If green: bootstrap is done. Report:

> _"You're set up. The starter compiles and runs cleanly. What do you
> want to build first?"_

If red: read the error, fix it (it's almost always a missing env var
or a Tailwind/PostCSS misconfig from a stale fork), and re-try once
before reporting to the user.

## Make the first commit if there are none

If `git rev-list --count HEAD` returned `no-commits` (fresh fork or
template clone with no history yet), make a baseline commit so the
user has something to roll back to:

```bash
git add -A
git commit -m "Baseline — starter as forked"
```

Use the `git-commit` skill's safety checks (no `.env*`, no secrets).

## Idempotency

This skill is safe to re-run. Each step starts with a detection — if
Node is already 22, you skip the install. If `node_modules/` exists,
you skip `npm install`. If there's already a commit, you skip the
baseline. Re-running should print _"Everything's already set up."_

## What you must NOT do

- ❌ Ask the user to type `npm install` themselves — you run it.
- ❌ Ask the user to type `node --version` themselves — you run it.
- ❌ Use `sudo` for any npm command. Ever. If a permissions issue
  arises, fix the ownership of `~/.npm`, never escalate npm itself.
- ❌ Skip the verification build. A silent failure here costs the user
  hours later.
- ❌ Install Node via the GUI installer when you could have installed
  it via shell. The shell path is one chat turn; the GUI path requires
  re-opening Claude Desktop.

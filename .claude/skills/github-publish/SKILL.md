---
name: github-publish
description: Help a non-technical user publish their fork to their personal GitHub account for the first time, or push subsequent updates. Walk through the GitHub UI and minimal CLI commands.
---

# Publishing to GitHub (for users who've never used GitHub)

The user said _"put it on GitHub"_, _"publish my code"_, _"upload my
project"_. They want their work visible on github.com under their
account.

**Division of labor (Rule 0 applies):** you run every `git` and `gh`
command yourself. The user only does the things you literally can't do
for them — clicking buttons on github.com, signing in, and copy-pasting
their new repo URL back to you. Do not ask the user to type a `git`
command at any point.

## Step 0 — Figure out where they are

Run these in parallel and tell the user **in plain English** what they
mean:

```bash
git remote -v
git status
git log --oneline -5
```

Three possible situations:

| Situation                                   | Path                            |
| ------------------------------------------- | ------------------------------- |
| `origin` already points to **their** GitHub | "Push subsequent updates" below |
| `origin` points to the Leaply template repo | "First-time publish" below      |
| No `origin` set / fresh clone               | "First-time publish" below      |

## First-time publish

The user needs **their own** GitHub repository to push into. They create
it in the browser; you wire it up locally.

### 1. Walk them through creating the repo

Say (literally — copy this script):

> 1.  Open <https://github.com/new> in your browser.
> 2.  In **Repository name**, type a short name with no spaces — for
>     example, `my-leaply-app`.
> 3.  Choose **Private** if you don't want others to see the code, or
>     **Public** if you do.
> 4.  **Do not** check "Add a README", "Add .gitignore", or "Choose a
>     license" — your project already has those.
> 5.  Click **Create repository**.
> 6.  On the next page, you'll see a URL like
>     `https://github.com/your-username/my-leaply-app.git`. **Copy that
>     URL** and paste it back here.

Wait for the user to paste the URL.

### 2. Save uncommitted changes first

```bash
git status
```

If there are uncommitted changes, run the `git-commit` skill before
pushing — pushing only sends saved snapshots.

### 3. Point the project at the user's new repo

Replace any existing `origin`:

```bash
git remote remove origin 2>/dev/null
git remote add origin <URL the user pasted>
```

### 4. Push for the first time

Modern GitHub repos use `main` as the default branch. Make sure the
local branch matches:

```bash
git branch -M main
git push -u origin main
```

GitHub will prompt for authentication. The friendliest path for a
non-technical user:

- If they have **GitHub Desktop** or the **`gh` CLI** logged in,
  pushing Just Works.
- Otherwise, the terminal opens a browser window asking them to sign
  in. Tell them: _"A browser tab just opened — sign in to GitHub there,
  then come back here."_

If the push fails with `Authentication failed`:

1. Suggest installing the GitHub CLI: <https://cli.github.com>
2. Then `gh auth login` (choose GitHub.com → HTTPS → "Login with a web
   browser") and retry `git push -u origin main`.

### 5. Confirm

```bash
git remote -v
```

Then tell the user: _"Done — open
https://github.com/your-username/my-leaply-app in your browser to see
your code online."_

## Pushing subsequent updates

After the first push, the workflow is just:

```bash
git push
```

Before that, the user must have **committed** the changes — see
`.claude/skills/git-commit/SKILL.md`. If `git push` says "Everything
up-to-date", there's nothing new to publish; check `git status`.

## What you must NOT do

- ❌ Force-push (`git push --force` / `--force-with-lease`) without an
  explicit ask. It can erase work on the remote.
- ❌ Push to a repo that isn't the user's (e.g. the Leaply template's
  `origin`). Always confirm `git remote -v` shows their username.
- ❌ Run `gh repo create` silently — the user should create the repo in
  the browser so they understand they own it. The browser flow is
  pedagogical, not just procedural.
- ❌ Push `.env*` files. They're in `.gitignore` already; do not remove
  them from `.gitignore`.

## After publishing — next step

Most users will want to **deploy** (make it a live website) immediately
after their first push. Proactively suggest:

> _"Your code is on GitHub now. Want me to put it on the internet as a
> live website? It's free with Vercel."_

Then proceed with `.claude/skills/vercel-deploy/SKILL.md`.

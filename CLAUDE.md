# CLAUDE.md — Leaply Vibe-Coder Starter

This file is loaded into every Claude session in this repository. Read it
before doing anything else. It defines **who the user is**, **what this
project is**, and **the non-negotiable rules** you must follow.

---

## 1. Who is the user?

The user is a **Leaply employee using Claude Desktop**. Assume:

- **Not a software engineer.** They will not read code. They do not use
  the terminal. They expect _you_ to run every command — see Rule 0.
- **No knowledge of Git, GitHub, or Vercel internals.** Words like "branch",
  "commit", "push", "pull request", "deploy", "environment variable" are
  unfamiliar. Never use them without a one-sentence explanation in the same
  message.
- **Forked this repository as a starter.** Their goal is to build a working
  web app and put it on the internet — not to understand the toolchain.
- **Publishes via their personal GitHub account.** They sign in to GitHub
  in a browser.
- **Deploys via Vercel's free Hobby tier.** They sign in to Vercel with
  their GitHub account.

### How to talk to them

- Speak plainly. No jargon. If you must use a technical term, define it
  inline: _"a commit (a saved snapshot of your changes)"_.
- **Run commands yourself, then translate the result.** Don't paste raw
  terminal output at the user. Summarize: _"Installed 487 packages, no
  errors,"_ or _"The build failed with one TypeScript error in
  `app/page.tsx` — I'll fix it now."_
- When the user **must** act (a button on github.com, a password
  prompt, downloading an installer), give one numbered step at a time
  in plain English.
- Confirm before destructive actions. Always.
- Match the user's language. If they write in Russian/Ukrainian, reply in
  the same language. Code, identifiers, commit messages, and file contents
  stay in English regardless.

---

## 1b. First session in a fresh fork — bootstrap silently

The user may have just forked the repo and have **nothing installed
yet**. They will not say _"please bootstrap"_; they'll say _"hi"_ or
_"add a contact form"_ and expect things to work. Your job on the first
session is to detect the empty state and fix it **before** doing what
they asked.

**Always run the [`first-run`](.claude/skills/first-run/SKILL.md) skill
proactively on the first turn of a fresh checkout.** It is idempotent —
re-running on an already-set-up project is a no-op that takes 2 seconds.

Quick summary of what `first-run` does so you understand the flow:

1. **You run** `node --version`, `git --version`, check for
   `node_modules/`.
2. If Node is missing, **you install it yourself** — first try
   `brew install node@22`, then `fnm`, then (only as last resort) ask
   the user to download the GUI installer from nodejs.org. You do not
   default to the GUI path.
3. **You run** `npm install`.
4. **You run** `npm run build` to verify everything compiles.
5. **You report** in one sentence: _"You're set up. What do you want
   to build?"_

The only moments the user does anything in step 2:

- They paste **one line** (`sudo chown -R $(whoami) ~/.npm`) if a past
  bad `sudo npm` corrupted their npm cache — `sudo` requires their
  password, which you can't provide.
- They re-open Claude Desktop **once** after Node is installed so the
  shell sees the new PATH.
- On Windows without `winget`, they run the GUI installer from
  nodejs.org. (Most Windows machines have `winget` since Windows 10
  21H2 / Windows 11 — you should try `winget` first.)

Everything else is your job.

See [`.claude/skills/first-run/SKILL.md`](.claude/skills/first-run/SKILL.md)
for the full detection/install/verification script.

---

## 2. What is this project?

A **Next.js + shadcn/ui starter** that any non-technical Leaply teammate
can fork, build on with Claude, push to GitHub, and deploy to Vercel.

### Architecture (fixed — do not deviate)

| Layer             | Choice                                                |
| ----------------- | ----------------------------------------------------- |
| Framework         | **Next.js** (App Router, RSC enabled)                 |
| UI components     | **shadcn/ui** (installed via CLI, never hand-written) |
| Styling           | Tailwind CSS v4                                       |
| Icons             | `@remixicon/react`                                    |
| State management  | **zustand** (and only zustand — no Redux, no Jotai)   |
| Schema/validation | **zod** (forms, API boundaries, env parsing)          |
| Charts            | **shadcn Chart + Recharts** (never raw Recharts)      |
| Theming           | `next-themes`                                         |
| Language          | TypeScript, strict mode                               |

If a request implies a different framework or library, **stop and explain
the constraint** instead of silently switching.

### Repository layout

```
app/                Next.js App Router pages and layouts
components/         App components (one per file)
components/ui/      shadcn-generated components — DO NOT EDIT BY HAND
hooks/              Custom React hooks
lib/                Pure utilities, zod schemas, zustand stores
public/             Static assets
.claude/skills/     Task-specific skills you should invoke when relevant
```

---

## 3. The non-negotiable rules

These are the rules that make the starter safe for non-technical users.
Violating them creates problems the user cannot debug.

### Rule 0 — You are the operator. The user only talks.

**This is the most important rule. Every other rule assumes it.**

You have terminal, file, and web access through Claude Desktop. The user
does not. The user's job is to **describe what they want**; your job is
to **make it happen**, end to end:

- `npm install`, `npm run dev`, `npm run build`, `npm run check` — **you
  run**. Don't say _"now run `npm install` in the terminal"_. Just run
  it and report the result in plain English: _"Installed. 487 packages,
  no errors."_
- `npx shadcn@latest add button` — **you run**.
- `git status`, `git add`, `git commit` — **you run**. Even though it's
  the user's repo, they shouldn't have to type git commands.
- Reading and editing files — **you do**, via your file tools. Don't
  tell the user to "open `app/page.tsx` and change line 23".
- Visiting docs pages, checking npm package compatibility — **you do**,
  via web fetch.

**The only times the user steps in:**

1. **One-time installs that require admin / a GUI installer:**
   Node.js, Claude Desktop, Git for Windows. You walk them through it
   in plain words because you can't double-click `.pkg` files.
2. **Browser actions on third-party sites that need their login:**
   creating a repo on github.com, importing a project on vercel.com,
   adding an env var in the Vercel dashboard. You give exact click
   instructions; they click.
3. **Typing passwords / secrets:** never put a secret in chat. The user
   pastes API keys into `.env.local` themselves, or into the Vercel
   dashboard themselves.
4. **Explicit confirmation before destructive actions:** deleting files,
   discarding uncommitted changes, force-pushing, deleting branches.
   Ask in plain English, wait for "yes".

If you catch yourself writing _"now run …"_ or _"please execute …"_,
**stop and run it yourself instead**. The user reads commands like text
they don't understand; they trust you to operate the machinery.

Report what you did in plain English after the fact. The terminal
output is shown to the user automatically — your job is to translate it:
_"Saved a snapshot called 'Add contact form'. You have 3 snapshots
total."_

### Rule 1 — shadcn components: install, don't write

When a UI primitive is needed (button, dialog, input, dropdown, sheet,
toast, table, etc.):

1. **Check first** whether it already exists in `components/ui/`.
2. If not, install it with the shadcn CLI:
   ```bash
   npx shadcn@latest add <component>
   ```
3. Import it via the `@/components/ui/<name>` alias.

Never paste a hand-written `Button.tsx` based on memory. The version,
prop API, and styling tokens drift; the CLI keeps them in sync with
`components.json`. See `.claude/skills/shadcn-component/SKILL.md`.

### Rule 2 — Decompose components over ~200 lines

When a `.tsx` file in `components/` or `app/` exceeds **200 lines**, split
it. Extract sub-components, custom hooks, or pure helpers into sibling
files. See `.claude/skills/decompose-component/SKILL.md`.

This applies both when **creating** new components and when **editing**
existing ones that have grown.

### Rule 3 — State management is zustand, period

Anything beyond local `useState` goes in a zustand store under
`lib/stores/`. No prop drilling more than 2 levels deep. See
`.claude/skills/state-management/SKILL.md`.

### Rule 4 — All external data is parsed with zod

Anything crossing the trust boundary — form input, `fetch` responses,
`process.env`, URL params, localStorage — passes through a zod schema
before use. See `.claude/skills/validation/SKILL.md`.

### Rule 5 — Quality gates must stay green

Before reporting a task complete:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm run format      # Prettier
npm run build       # Production build (catches RSC/use-client mistakes)
```

A pre-commit hook (`husky` + `lint-staged`) auto-fixes formatting and
lint errors on every commit. If the hook fails, **fix the underlying
issue** — never bypass with `--no-verify`.

### Rule 6 — Version-check before installing

`npm install some-pkg` without a version pulls the latest, which may
break with the user's React 19 / Next 16 / Tailwind 4 setup. Before
adding a dependency:

1. Check the package's npm page or README for "Next.js 16" / "React 19"
   support.
2. If unsure, prefer an alternative that's already in `package.json`.
3. After install, run `npm run build` to confirm nothing broke.

### Rule 7 — Never commit secrets

API keys, tokens, passwords go in `.env.local` (gitignored). They are
referenced as `process.env.X` and **must** be parsed via zod (see Rule 4).
For production, they go in the Vercel dashboard — see
`.claude/skills/vercel-deploy/SKILL.md`.

---

## 4. Standard workflows (the user will ask for these)

Each lives in its own skill file. When the user describes one of these
intents in plain words, open the matching skill:

| User says (paraphrased)                        | Skill                                         |
| ---------------------------------------------- | --------------------------------------------- |
| _first turn of a fresh fork (no explicit ask)_ | `.claude/skills/first-run/SKILL.md`           |
| "save my work" / "I want to keep this"         | `.claude/skills/git-commit/SKILL.md`          |
| "put it on GitHub" / "publish"                 | `.claude/skills/github-publish/SKILL.md`      |
| "put it online" / "make it a real website"     | `.claude/skills/vercel-deploy/SKILL.md`       |
| "I have an API key" / "I need a secret"        | `.claude/skills/env-variables/SKILL.md`       |
| "add a button/modal/form"                      | `.claude/skills/shadcn-component/SKILL.md`    |
| "add a chart/graph" / "visualize data"         | `.claude/skills/charts/SKILL.md`              |
| "this file is too big"                         | `.claude/skills/decompose-component/SKILL.md` |
| "remember this across pages"                   | `.claude/skills/state-management/SKILL.md`    |
| "check this input" / "validate"                | `.claude/skills/validation/SKILL.md`          |

The user will not name the skill. You must recognize the intent.

---

## 5. Default behaviors in this repo

- **Start the dev server** when the user wants to see something:
  `npm run dev` → open <http://localhost:3000>.
- **Stop and ask** before installing any dependency the user didn't
  request by name — they may not realize what's being added.
- **Never delete files** outside `app/`, `components/` (excluding `ui/`),
  `hooks/`, `lib/`, `public/` without confirming.
- **Don't touch** `components/ui/*` by hand — re-run the shadcn CLI to
  regenerate.
- **Don't touch** `components.json`, `tsconfig.json`, `next.config.mjs`,
  `eslint.config.mjs`, `.prettierrc`, `.husky/*` unless the user
  explicitly asks you to change tooling.
- **Commit small.** One feature = one commit. The user reads the commit
  history in the GitHub UI; it should tell a story.

---

## 6. When in doubt

1. Re-read this file.
2. Open the relevant skill in `.claude/skills/`.
3. If still unclear, ask the user — in plain language — for the missing
   piece. One question at a time.

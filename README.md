# Leaply Starter — build a web app with Claude

This is the **Leaply starter project**. It's set up so anyone — even if
you've never written code — can build a real web app by chatting with
Claude, put it on GitHub, and publish it to the internet for free.

## How this works (read this first)

**You don't write code. You don't type terminal commands. You don't
click around in Git.** You talk to Claude in Claude Desktop and Claude does the work:

- Installing packages, running the app, building it — Claude.
- Adding components, editing files — Claude.
- Saving versions, publishing to GitHub, deploying to Vercel — Claude.

**You only step in when it's something Claude literally can't do for
you:**

1. **Installing apps on your computer** (Claude Desktop itself,
   Node.js, Git). These are one-time, ~10-minute setups with regular
   installer windows.
2. **Clicking buttons on websites you log into** — creating a repo on
   github.com, importing a project on vercel.com. Claude tells you
   exactly where to click; you click.
3. **Typing your own passwords / API keys** — never share these in
   chat. You paste them directly into a settings page or a hidden file.

That's it. Everything else is _"Hey Claude, do X"_.

---

## What's in the box

A modern web app foundation:

- **Next.js** — the framework that runs the app.
- **shadcn/ui** — a library of polished UI components (buttons, dialogs,
  forms, etc.). Claude adds them by command, never by hand.
- **Tailwind CSS** — styling.
- **TypeScript** — type-safe code, fewer bugs.
- **zustand** — for remembering things across pages (themes, carts,
  user preferences).
- **zod** — for validating anything coming from outside the app (forms,
  API responses, settings).
- **Recharts** (via shadcn Chart) — for line, bar, area, and pie
  charts that match your app's theme.
- **Prettier + ESLint + Husky** — auto-formats and checks your code
  every time you save a snapshot, so it stays clean.

You don't need to know what any of this is. Claude does.

---

## First-time setup (~3 minutes of your time)

You only need **one** thing yourself: **Claude Desktop.**

1. Download from <https://claude.ai/download> and install it.
2. Sign in with your Leaply account.
3. Open this project folder in Claude Desktop and just say _"hi"_ (or
   _"set me up"_, or _"let's start building"_ — anything).

**Claude does the rest.** On the first message, Claude detects what's
missing on your computer and installs it for you, end-to-end:

- ✅ **Node.js** (the engine that runs the app) — Claude installs
  Node 22 automatically using the tools already on your system
  (Homebrew on Mac, winget on Windows, or a small built-in installer
  called `fnm`).
- ✅ **Project dependencies** — Claude runs `npm install` for you
  (~1–3 minutes the first time).
- ✅ **Verification build** — Claude makes sure the starter actually
  compiles before reporting back.

When it's done, Claude says something like _"You're set up. What do
you want to build?"_ and you go.

### The (rare) two moments you might have to do something

These only happen if Claude's automatic install can't proceed:

1. **Re-open Claude Desktop once.** After Node is installed, Claude
   Desktop needs to relaunch so the new tools are visible. Claude
   tells you exactly when to do this.
2. **Paste one line into your terminal.** If your computer has an old
   broken `npm` setup, Claude can't fix it without your password.
   Claude will give you a single line to copy-paste and type your
   password — that's it. Nothing else.

### What if I'm on Windows and don't have `winget`?

Claude will tell you to download the Node.js installer from
<https://nodejs.org/en/download> (green LTS button). It's a regular
Windows installer — accept all defaults, restart Claude Desktop, done.

### What about Git?

You don't deal with Git. Claude uses it under the hood. On Mac it's
already there; on Windows Claude will direct you to
<https://git-scm.com/download/win> if it's missing.

---

## How to work with Claude on this project

Open this folder in Claude Desktop. Then ask in plain English. Some
examples:

- _"Add a contact form to the home page."_
- _"Make the header dark blue."_
- _"Add a button that opens a popup with our pricing."_
- _"Remember the user's favorite color across pages."_
- _"I have an OpenAI API key — how do I use it safely?"_
- _"Save this version."_ → Claude creates a Git snapshot.
- _"Put it on GitHub."_ → Claude walks you through publishing.
- _"Put it online as a real website."_ → Claude walks you through
  deploying to Vercel (free).

Claude already knows the project's conventions because of two files:

- `CLAUDE.md` — main instructions Claude reads every session.
- `.claude/skills/` — focused guides for specific tasks (saving,
  publishing, deploying, adding components, …).

You never need to read those — but they're there if you're curious.

---

## Seeing your app while you build

Just say: _"Show me the app."_ or _"Start the preview."_

Claude starts the development server in the background, then gives you
a link (usually <http://localhost:3000>) to open in your browser. The
page reloads automatically every time Claude changes something.

When you're done, say _"Stop the preview."_ — Claude shuts it down.

---

## The three things Claude can help you do end-to-end

### 1. Save your work

Whenever you want to keep a version you can come back to, say:

> _"Save this."_

Claude takes a snapshot (a "commit") with a clear name describing what
changed.

### 2. Publish to GitHub

When you're ready for your code to live online (not the website yet —
just the source code), say:

> _"Put my project on GitHub."_

Claude will walk you through creating a GitHub repository in your
browser and connecting this project to it.

### 3. Deploy a live website (free)

To turn it into a real public website with a URL you can share, say:

> _"Make this a live website."_

Claude will walk you through Vercel's free plan. Every time you save
and publish a new version afterward, the website updates automatically.

---

## If something looks wrong

- **The page won't load** → ask Claude: _"The page isn't loading. Can
  you check?"_
- **Claude proposes a change you don't understand** → ask: _"Explain
  this in simpler words."_
- **You deployed and the live site is broken** → ask: _"My Vercel
  deployment failed. Can you help me check the logs?"_

Claude knows what to do in each of these cases.

---

## Don't touch (unless you know what you're doing)

These files keep everything wired together. Editing them by hand will
likely break things. Let Claude handle them:

- `package.json`, `package-lock.json`
- `tsconfig.json`, `next.config.mjs`
- `components.json`, `eslint.config.mjs`, `.prettierrc`
- `.husky/`
- Anything in `components/ui/` (those are auto-generated)

---

Built for Leaply. Happy vibe-coding. ✦
